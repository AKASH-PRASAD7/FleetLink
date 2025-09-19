import VehicleResults from '../VehicleResults';
import { AvailableVehicle, VehicleSearch } from '@shared/schema';

export default function VehicleResultsExample() {
  // todo: remove mock functionality
  const mockVehicles: AvailableVehicle[] = [
    {
      id: "1",
      name: "Fleet-001",
      capacityKg: 1500,
      tyres: 6,
      estimatedRideDurationHours: 8
    },
    {
      id: "2", 
      name: "Delivery Truck Alpha",
      capacityKg: 800,
      tyres: 4,
      estimatedRideDurationHours: 8
    },
    {
      id: "3",
      name: "Heavy Hauler Beta",
      capacityKg: 2500,
      tyres: 10,
      estimatedRideDurationHours: 8
    }
  ];

  const mockSearchParams: VehicleSearch = {
    capacityRequired: 500,
    fromPincode: "110001",
    toPincode: "400001",
    startTime: new Date().toISOString()
  };

  const handleBookVehicle = (vehicleId: string) => {
    console.log('Booking vehicle:', vehicleId);
  };

  return (
    <VehicleResults 
      vehicles={mockVehicles}
      searchParams={mockSearchParams}
      onBookVehicle={handleBookVehicle}
    />
  );
}