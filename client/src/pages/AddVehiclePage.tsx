import AddVehicleForm from "@/components/AddVehicleForm";
import { InsertVehicle } from "@shared/schema";

export default function AddVehiclePage() {
  const handleAddVehicle = async (vehicle: InsertVehicle) => {
    try {
      // todo: replace with actual API call
      console.log("Adding vehicle:", vehicle);

      // Simulate API call
      const response = await fetch("http://localhost:8000/api/v1/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicle),
      });

      if (!response.ok) {
        throw new Error("Failed to add vehicle");
      }

      const result = await response.json();
      console.log("Vehicle added successfully:", result);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Add New Vehicle</h1>
        <p className="text-muted-foreground mt-2">
          Add a new vehicle to your fleet. Enter the vehicle details below.
        </p>
      </div>

      <AddVehicleForm onSubmit={handleAddVehicle} />
    </div>
  );
}
