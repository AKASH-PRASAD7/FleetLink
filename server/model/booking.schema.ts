import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  id: string;
  vehicleId: Schema.Types.ObjectId;
  fromPincode: string;
  toPincode: string;
  startTime: Date;
  endTime: Date;
  customerId: string;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    vehicleId: { type: Schema.Types.ObjectId, required: true },
    fromPincode: { type: String, required: true },
    toPincode: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    customerId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
