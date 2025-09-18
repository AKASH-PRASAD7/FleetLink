import mongoose, { Schema, Document } from "mongoose";

export interface IReservationSlot extends Document {
  vehicleId: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  bookingId?: string;
  reservedAt: Date;
  expiresAt: Date;
}

const ReservationSlotSchema: Schema<IReservationSlot> = new Schema(
  {
    vehicleId: { type: Schema.Types.ObjectId, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    bookingId: { type: String },
    reservedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReservationSlot>(
  "ReservationSlot",
  ReservationSlotSchema
);
