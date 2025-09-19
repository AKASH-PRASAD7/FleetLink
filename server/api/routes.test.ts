import request from "supertest";
import express from "express";
import routes from "./routes";
import Vehicle from "../model/vehicle.schema";
import Booking from "../model/booking.schema";

// Mock the models
jest.mock("../model/vehicle.schema");
jest.mock("../model/booking.schema");

const app = express();
app.use(express.json());
app.use("/api/v1", routes);

describe("API Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/vehicles", () => {
    it("should create a new vehicle", async () => {
      const vehicleData = { name: "Test Vehicle", capacityKg: 1000, tyres: 4 };
      (Vehicle.create as jest.Mock).mockResolvedValue(vehicleData);

      const res = await request(app)
        .post("/api/v1/vehicles")
        .send(vehicleData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(vehicleData);
      expect(Vehicle.create).toHaveBeenCalledWith(vehicleData);
    });
  });

  describe("GET /api/v1/vehicles/available", () => {
    it("should return available vehicles", async () => {
      const searchParams = {
        capacityRequired: 500,
        fromPincode: "110001",
        toPincode: "400001",
        startTime: new Date().toISOString(),
      };

      const vehicles = [
        { _id: "1", name: "Test Vehicle 1", capacityKg: 1000, toObject: () => ({ _id: "1", name: "Test Vehicle 1", capacityKg: 1000 }) },
        { _id: "2", name: "Test Vehicle 2", capacityKg: 1200, toObject: () => ({ _id: "2", name: "Test Vehicle 2", capacityKg: 1200 }) },
      ];

      (Vehicle.find as jest.Mock).mockResolvedValue(vehicles);
      (Booking.findOne as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .get("/api/v1/vehicles/available")
        .query(searchParams);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe("Test Vehicle 1");
      expect(res.body[1].name).toBe("Test Vehicle 2");
    });
  });

  describe("GET /api/v1/vehicles", () => {
    it("should return all vehicles", async () => {
      const vehicles = [
        { name: "Test Vehicle 1", capacityKg: 1000 },
        { name: "Test Vehicle 2", capacityKg: 1200 },
      ];
      (Vehicle.find as jest.Mock).mockResolvedValue(vehicles);

      const res = await request(app).get("/api/v1/vehicles");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(vehicles);
    });
  });

  describe("POST /api/v1/bookings", () => {
    it("should create a new booking", async () => {
      const bookingData = {
        vehicleId: "1",
        fromPincode: "110001",
        toPincode: "400001",
        startTime: new Date().toISOString(),
        customerId: "test-customer",
      };

      const vehicle = { _id: "1", name: "Test Vehicle", capacityKg: 1000 };
      (Vehicle.findById as jest.Mock).mockResolvedValue(vehicle);
      (Booking.findOne as jest.Mock).mockResolvedValue(null);
      (Booking.create as jest.Mock).mockResolvedValue(bookingData);

      const res = await request(app)
        .post("/api/v1/bookings")
        .send(bookingData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(bookingData);
    });
  });

  describe("GET /api/v1/bookings", () => {
    it("should return all bookings", async () => {
      const bookings = [
        { vehicleId: "1", customerId: "test-customer" },
        { vehicleId: "2", customerId: "test-customer-2" },
      ];
      const populatedBookings = [
        { vehicleId: { name: "Test Vehicle 1" }, customerId: "test-customer" },
        { vehicleId: { name: "Test Vehicle 2" }, customerId: "test-customer-2" },
      ];

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(populatedBookings),
      };
      (Booking.find as jest.Mock).mockReturnValue(mockQuery);

      const res = await request(app).get("/api/v1/bookings");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(populatedBookings);
    });
  });
  describe("DELETE /api/v1/bookings/:id", () => {
    it("should delete a booking", async () => {
      const bookingId = "1";
      (Booking.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: bookingId });

      const res = await request(app).delete(`/api/v1/bookings/${bookingId}`);

      expect(res.status).toBe(204);
    });
  });
});
