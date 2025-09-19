import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, CircleDot, Clock, MapPin } from "lucide-react";
import { AvailableVehicle, VehicleSearch } from "@shared/schema";

interface VehicleResultsProps {
  vehicles: AvailableVehicle[];
  searchParams?: VehicleSearch;
  onBookVehicle?: (vehicleId: string) => void;
  isLoading?: boolean;
}

export default function VehicleResults({ 
  vehicles, 
  searchParams, 
  onBookVehicle,
  isLoading = false 
}: VehicleResultsProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Searching for available vehicles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Vehicles Available</h3>
          <p className="text-muted-foreground">
            No vehicles match your search criteria. Try adjusting the capacity requirement or time slot.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" data-testid="text-results-title">
          Available Vehicles ({vehicles.length})
        </h2>
        {searchParams && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span data-testid="text-route-info">
              {searchParams.fromPincode} → {searchParams.toPincode}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover-elevate" data-testid={`card-vehicle-${vehicle.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium" data-testid={`text-vehicle-name-${vehicle.id}`}>
                      {vehicle.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium" data-testid={`text-capacity-${vehicle.id}`}>
                          {vehicle.capacityKg} kg
                        </span>
                        <span className="text-muted-foreground"> capacity</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CircleDot className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium" data-testid={`text-tyres-${vehicle.id}`}>
                          {vehicle.tyres}
                        </span>
                        <span className="text-muted-foreground"> tyres</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary" data-testid={`badge-duration-${vehicle.id}`}>
                        {vehicle.estimatedRideDurationHours}h duration
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => onBookVehicle?.(vehicle.id)}
                  data-testid={`button-book-${vehicle.id}`}
                >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}