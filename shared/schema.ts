import { z } from "zod";

// Pure Zod schemas for MongoDB collections

// Vehicle schema
export const vehicleSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectId as string
  id: z.string(), // String ID for API responses
  name: z.string().min(1),
  capacityKg: z.number().min(1),
  tyres: z.number().min(1),
});

// Booking schema
export const bookingSchema = z.object({
  _id: z.string(), // MongoDB ObjectId as string
  // id: z.string(), // String ID for API responses
  vehicleId: z.string(),
  fromPincode: z.string().min(1),
  toPincode: z.string().min(1),
  startTime: z.date(),
  endTime: z.date(),
  customerId: z.string().min(1),
});

// Reservation slot schema for conflict-free booking pattern
export const reservationSlotSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectId as string
  vehicleId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  bookingId: z.string().optional(), // Set when booking is confirmed
  reservedAt: z.date(),
  expiresAt: z.date(), // Reservation expires after 5 minutes
});

// Insert schemas (omit generated fields)
export const insertVehicleSchema = vehicleSchema
  .omit({
    _id: true,
    id: true,
  })
  .extend({
    capacityKg: z.coerce.number().min(1, "Capacity must be at least 1 kg"),
    tyres: z.coerce.number().min(1, "Must have at least 1 tyre"),
  });

export const insertBookingSchema = bookingSchema.omit({
  _id: true,
  id: true,
  endTime: true,
});

// Vehicle availability search schema
export const vehicleSearchSchema = z.object({
  capacityRequired: z.number().min(1),
  fromPincode: z.string().min(1),
  toPincode: z.string().min(1),
  startTime: z.coerce.date(),
});

// Types
export type Vehicle = z.infer<typeof vehicleSchema>;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type ReservationSlot = z.infer<typeof reservationSlotSchema>;
export type VehicleSearch = z.infer<typeof vehicleSearchSchema>;

// Extended types for API responses
export type AvailableVehicle = Vehicle & {
  estimatedRideDurationHours: number;
};
