import { useState } from 'react';
import BookingModal from '../BookingModal';
import { Button } from '@/components/ui/button';
import { AvailableVehicle, VehicleSearch, InsertBooking } from '@shared/schema';

export default function BookingModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  // todo: remove mock functionality
  const mockVehicle: AvailableVehicle = {
    id: "1",
    name: "Fleet-001",
    capacityKg: 1500,
    tyres: 6,
    estimatedRideDurationHours: 8
  };

  const mockSearchParams: VehicleSearch = {
    capacityRequired: 500,
    fromPincode: "110001",
    toPincode: "400001", 
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
  };

  const handleConfirmBooking = async (booking: InsertBooking) => {
    console.log('Booking confirmed:', booking);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>
        Open Booking Modal
      </Button>
      <BookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        vehicle={mockVehicle}
        searchParams={mockSearchParams}
        onConfirmBooking={handleConfirmBooking}
      />
    </div>
  );
}