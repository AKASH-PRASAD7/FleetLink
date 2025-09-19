import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  name: string;
  capacityKg: number;
  tyres: number;
}

const VehicleSchema: Schema<IVehicle> = new Schema(
  {
    name: { type: String, required: true },
    capacityKg: { type: Number, required: true, min: 1 },
    tyres: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);
export default Vehicle;
