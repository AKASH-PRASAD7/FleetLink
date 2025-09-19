import { useState, useEffect } from "react";
import { Vehicle } from "@shared/schema";
import VehicleList from "@/components/VehicleList";
import { useToast } from "@/hooks/use-toast";

export default function AllVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/v1/vehicles");
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast({
          title: "Error",
          description: "Failed to fetch vehicles. Please try again later.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    fetchVehicles();
  }, [toast]);

  return (
    <div className="max-w-6xl mx-auto h-screen space-y-4">
      <div>
        <h1 className="text-3xl font-bold">All Vehicles</h1>
        <p className="text-muted-foreground mt-2">
          Browse the complete list of vehicles in the fleet.
        </p>
      </div>
      <VehicleList vehicles={vehicles} isLoading={isLoading} />
    </div>
  );
}
