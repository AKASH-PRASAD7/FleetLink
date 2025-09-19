import AddVehicleForm from '../AddVehicleForm';
import { InsertVehicle } from '@shared/schema';

export default function AddVehicleFormExample() {
  const handleSubmit = async (vehicle: InsertVehicle) => {
    // Demo functionality - log the vehicle data
    console.log('Vehicle form submitted:', vehicle);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return <AddVehicleForm onSubmit={handleSubmit} />;
}