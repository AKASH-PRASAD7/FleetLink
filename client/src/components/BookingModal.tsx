import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck, MapPin, Clock, Package, User } from "lucide-react";
import { AvailableVehicle, VehicleSearch, InsertBooking } from "@shared/schema";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: AvailableVehicle;
  searchParams?: VehicleSearch;
  onConfirmBooking?: (booking: InsertBooking) => Promise<void>;
}

export default function BookingModal({
  isOpen,
  onClose,
  vehicle,
  searchParams,
  onConfirmBooking
}: BookingModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmBooking = async () => {
    if (!vehicle || !searchParams || !customerId.trim()) return;

    setIsSubmitting(true);
    try {
      const bookingData: InsertBooking = {
        vehicleId: vehicle.id,
        fromPincode: searchParams.fromPincode,
        toPincode: searchParams.toPincode,
        startTime: new Date(searchParams.startTime),
        customerId: customerId.trim(),
      };

      if (onConfirmBooking) {
        await onConfirmBooking(bookingData);
      } else {
        // Demo functionality
        console.log("Booking confirmed:", bookingData);
      }
      setIsConfirmed(true);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCustomerId("");
    setIsSubmitting(false);
    setIsConfirmed(false);
    onClose();
  };

  if (!vehicle || !searchParams) return null;

  const estimatedEndTime = new Date(new Date(searchParams.startTime).getTime() + vehicle.estimatedRideDurationHours * 60 * 60 * 1000);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" data-testid="modal-booking">
        {isConfirmed ? (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <DialogHeader>
              <DialogTitle className="text-green-700" data-testid="text-booking-confirmed">
                Booking Confirmed!
              </DialogTitle>
              <DialogDescription>
                Your vehicle has been successfully booked.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={handleClose} className="w-full" data-testid="button-close-confirmation">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Confirm Booking
              </DialogTitle>
              <DialogDescription>
                Review the booking details and confirm your reservation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Vehicle Details */}
              <div className="space-y-3">
                <h4 className="font-medium">Vehicle Details</h4>
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="text-sm font-medium" data-testid="text-booking-vehicle-name">
                      {vehicle.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Capacity:</span>
                    <Badge variant="secondary" data-testid="text-booking-capacity">
                      {vehicle.capacityKg} kg
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Route & Timing */}
              <div className="space-y-3">
                <h4 className="font-medium">Route & Timing</h4>
                <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm" data-testid="text-booking-route">
                      {searchParams.fromPincode} → {searchParams.toPincode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="font-medium">Start:</span>{" "}
                        <span data-testid="text-booking-start-time">
                          {new Date(searchParams.startTime).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Est. End:</span>{" "}
                        <span data-testid="text-booking-end-time">
                          {estimatedEndTime.toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="outline" data-testid="text-booking-duration">
                        {vehicle.estimatedRideDurationHours}h duration
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer ID Input */}
              <div className="space-y-2">
                <Label htmlFor="customerId" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer ID
                </Label>
                <Input
                  id="customerId"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter customer identifier"
                  data-testid="input-customer-id"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleClose} className="flex-1" data-testid="button-cancel-booking">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  disabled={!customerId.trim() || isSubmitting}
                  className="flex-1"
                  data-testid="button-confirm-booking"
                >
                  {isSubmitting ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}