import { Router } from "express";
import Vehicle from "../model/vehicle.schema";
import Booking from "../model/booking.schema";
import { z } from "zod";

const app: Router = Router();

// Zod schemas for validation
const insertVehicleSchema = z.object({
  name: z.string(),
  capacityKg: z.number().positive(),
  tyres: z.number().positive(),
});

const vehicleSearchSchema = z.object({
  capacityRequired: z.number().positive(),
  fromPincode: z.string(),
  toPincode: z.string(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date",
  }),
});

const insertBookingSchema = z.object({
  vehicleId: z.string(),
  fromPincode: z.string(),
  toPincode: z.string(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date",
  }),
  customerId: z.string(),
});

// --- Helper: Calculate ride duration ---
function calculateRideDuration(fromPincode: string, toPincode: string): number {
  return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
}

// 1. POST /vehicles
app.post("/vehicles", async (req, res) => {
  try {
    const vehicleData = insertVehicleSchema.parse(req.body);
    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    } else {
      console.error("Error creating vehicle:", error);
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  }
});

// 2. GET /vehicles/available
app.get("/vehicles/available", async (req, res) => {
  try {
    const searchParams = vehicleSearchSchema.parse({
      capacityRequired: parseInt(req.query.capacityRequired as string),
      fromPincode: req.query.fromPincode,
      toPincode: req.query.toPincode,
      startTime: req.query.startTime,
    });

    const estimatedRideDurationHours = calculateRideDuration(
      searchParams.fromPincode,
      searchParams.toPincode
    );

    const startTime = new Date(searchParams.startTime);
    const endTime = new Date(
      startTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000
    );

    // Step 1: Find all vehicles with enough capacity
    const vehicles = await Vehicle.find({
      capacityKg: { $gte: searchParams.capacityRequired },
    });

    // Step 2: Filter out vehicles with overlapping bookings
    const availableVehicles: any[] = [];
    for (const vehicle of vehicles) {
      const overlap = await Booking.findOne({
        vehicleId: vehicle._id,
        $or: [
          {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
          },
        ],
      });

      if (!overlap) {
        availableVehicles.push({
          ...vehicle.toObject(),
          estimatedRideDurationHours,
        });
      }
    }

    res.status(200).json(availableVehicles);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid search parameters",
        errors: error.errors,
      });
    } else {
      console.error("Error searching vehicles:", error);
      res.status(500).json({ message: "Failed to search vehicles" });
    }
  }
});

// 3. POST /bookings
app.post("/bookings", async (req, res) => {
  try {
    const bookingData = insertBookingSchema.parse(req.body);

    // Ensure vehicle exists
    const vehicle = await Vehicle.findById(bookingData.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Calculate duration and endTime
    const estimatedRideDurationHours = calculateRideDuration(
      bookingData.fromPincode,
      bookingData.toPincode
    );
    const startTime = new Date(bookingData.startTime);
    const endTime = new Date(
      startTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000
    );

    // Check for overlap before creating booking
    const overlap = await Booking.findOne({
      vehicleId: bookingData.vehicleId,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (overlap) {
      return res.status(409).json({
        message: "Vehicle is already booked for this time slot",
      });
    }

    // Create booking
    const newBooking = await Booking.create({
      vehicleId: bookingData.vehicleId,
      fromPincode: bookingData.fromPincode,
      toPincode: bookingData.toPincode,
      startTime,
      endTime,
      customerId: bookingData.customerId,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, // unique id
    });

    res.status(201).json(newBooking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid booking data",
        errors: error.errors,
      });
    } else {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  }
});

app.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Failed to fetch vehicles" });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("vehicleId");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

export default app;
