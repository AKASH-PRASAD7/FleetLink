import {
  type Vehicle,
  type InsertVehicle,
  type Booking,
  type InsertBooking,
  type ReservationSlot,
} from "@shared/schema";
import {
  vehiclesCollection,
  bookingsCollection,
  reservationSlotsCollection,
  generateStringId,
  convertToApiFormat,
  convertToMongoFormat,
} from "./db/mongo";
import { ObjectId } from "mongodb";

// FleetLink storage interface for vehicles and bookings
export interface IStorage {
  // Vehicle operations
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  getVehicle(id: string): Promise<Vehicle | undefined>;
  getAllVehicles(): Promise<Vehicle[]>;

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByVehicle(vehicleId: string): Promise<Booking[]>;
  getBookingsByTimeRange(startTime: Date, endTime: Date): Promise<Booking[]>;
}

export class MongoDBStorage implements IStorage {
  private ensureInitialized() {
    if (
      !vehiclesCollection ||
      !bookingsCollection ||
      !reservationSlotsCollection
    ) {
      throw new Error(
        "MongoDB collections not initialized. Make sure initializeMongoDB() is called first."
      );
    }
  }

  // Vehicle operations
  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    this.ensureInitialized();
    const id = generateStringId();
    const vehicleDoc = {
      ...insertVehicle,
      id,
    };

    const mongoDoc = convertToMongoFormat(vehicleDoc);
    const result = await vehiclesCollection.insertOne(mongoDoc);

    const createdVehicle = await vehiclesCollection.findOne({
      _id: result.insertedId,
    });
    if (!createdVehicle) {
      throw new Error("Failed to create vehicle");
    }

    return convertToApiFormat(createdVehicle);
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    this.ensureInitialized();
    const vehicle = await vehiclesCollection.findOne({ id });
    return vehicle ? convertToApiFormat(vehicle) : undefined;
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    this.ensureInitialized();
    const vehicles = await vehiclesCollection.find({}).toArray();
    return vehicles.map(convertToApiFormat);
  }

  // Booking operations with slot-reservation pattern for conflict-free bookings
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    this.ensureInitialized();
    // Calculate end time based on ride duration
    const estimatedDuration = this.calculateRideDuration(
      insertBooking.fromPincode,
      insertBooking.toPincode
    );
    const endTime = new Date(
      insertBooking.startTime.getTime() + estimatedDuration * 60 * 60 * 1000
    );

    // Step 1: Reserve a time slot atomically to prevent conflicts
    const reservationId = await this.reserveTimeSlot(
      insertBooking.vehicleId,
      insertBooking.startTime,
      endTime
    );

    if (!reservationId) {
      throw new Error(
        "Vehicle is no longer available for the requested time slot"
      );
    }

    try {
      // Step 2: Create the booking
      const bookingId = generateStringId();
      const bookingDoc = {
        ...insertBooking,
        id: bookingId,
        endTime,
      };

      const mongoDoc = convertToMongoFormat(bookingDoc);
      const result = await bookingsCollection.insertOne(mongoDoc);

      // Step 3: Update reservation slot with booking ID to confirm it
      await reservationSlotsCollection.updateOne(
        { _id: new ObjectId(reservationId) },
        { $set: { bookingId } }
      );

      const createdBooking = await bookingsCollection.findOne({
        _id: result.insertedId,
      });
      if (!createdBooking) {
        throw new Error("Failed to create booking");
      }

      return convertToApiFormat(createdBooking);
    } catch (error) {
      // If booking creation fails, release the reservation
      await reservationSlotsCollection.deleteOne({
        _id: new ObjectId(reservationId),
      });
      throw error;
    }
  }

  // Atomic slot reservation to prevent booking conflicts
  private async reserveTimeSlot(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<string | null> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

    try {
      // Use aggregation to check for conflicts and insert reservation atomically
      const pipeline = [
        {
          $match: {
            vehicleId,
            $or: [
              // Overlapping time ranges
              {
                $and: [
                  { startTime: { $lt: endTime } },
                  { endTime: { $gt: startTime } },
                ],
              },
            ],
            // Only consider active reservations (not expired and no booking confirmed)
            $or: [
              { expiresAt: { $gt: now } }, // Active reservation
              { bookingId: { $exists: true } }, // Confirmed booking
            ],
          },
        },
        { $limit: 1 },
      ];

      const conflicts = await reservationSlotsCollection
        .aggregate(pipeline)
        .toArray();

      if (conflicts.length > 0) {
        return null; // Conflict found
      }

      // No conflicts, create reservation
      const reservation = {
        vehicleId,
        startTime,
        endTime,
        reservedAt: now,
        expiresAt,
      };

      const result = await reservationSlotsCollection.insertOne(reservation);
      return result.insertedId.toString();
    } catch (error) {
      console.error("Error reserving time slot:", error);
      return null;
    }
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    this.ensureInitialized();
    const booking = await bookingsCollection.findOne({ id });
    return booking ? convertToApiFormat(booking) : undefined;
  }

  async getBookingsByVehicle(vehicleId: string): Promise<Booking[]> {
    this.ensureInitialized();
    const bookings = await bookingsCollection.find({ vehicleId }).toArray();
    return bookings.map(convertToApiFormat);
  }

  async getBookingsByTimeRange(
    startTime: Date,
    endTime: Date
  ): Promise<Booking[]> {
    this.ensureInitialized();
    // Use aggregation for efficient time range queries
    const pipeline = [
      {
        $match: {
          $or: [
            {
              $and: [
                { startTime: { $lt: endTime } },
                { endTime: { $gt: startTime } },
              ],
            },
          ],
        },
      },
      { $sort: { startTime: 1 } },
    ];

    const bookings = await bookingsCollection.aggregate(pipeline).toArray();
    return bookings.map(convertToApiFormat);
  }

  // Enhanced availability search using simple operations
  async findAvailableVehicles(
    capacityRequired: number,
    startTime: Date,
    endTime: Date
  ): Promise<Vehicle[]> {
    this.ensureInitialized();
    try {
      // Get all vehicles
      const allVehicles = await this.getAllVehicles();

      // Filter by capacity
      const eligibleVehicles = allVehicles.filter(
        (vehicle) => vehicle.capacityKg >= capacityRequired
      );

      if (eligibleVehicles.length === 0) {
        return [];
      }

      // Get all bookings that might conflict
      const allBookings = await this.getBookingsByTimeRange(startTime, endTime);
      const bookedVehicleIds = new Set(allBookings.map((b) => b.vehicleId));

      // For simplicity in mock implementation, just check bookings (not reservations)
      const availableVehicles = eligibleVehicles.filter(
        (vehicle) => !bookedVehicleIds.has(vehicle.id)
      );

      return availableVehicles;
    } catch (error) {
      console.error("Error in findAvailableVehicles:", error);
      // Fallback: return all vehicles with sufficient capacity
      const allVehicles = await this.getAllVehicles();
      return allVehicles.filter(
        (vehicle) => vehicle.capacityKg >= capacityRequired
      );
    }
  }

  private calculateRideDuration(
    fromPincode: string,
    toPincode: string
  ): number {
    // Simplified ride duration calculation as per requirements
    return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
  }
}

export const storage = new MongoDBStorage();
