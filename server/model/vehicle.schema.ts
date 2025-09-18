import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  id: Schema.Types.ObjectId;
  name: string;
  capacityKg: number;
  tyres: number;
}

const VehicleSchema: Schema<IVehicle> = new Schema(
  {
    id: { type: Schema.Types.ObjectId, required: true, unique: true },
    name: { type: String, required: true },
    capacityKg: { type: Number, required: true, min: 1 },
    tyres: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
