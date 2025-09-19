import { useState } from "react";
import VehicleSearch from "@/components/VehicleSearch";
import VehicleResults from "@/components/VehicleResults";
import BookingModal from "@/components/BookingModal";
import {
  VehicleSearch as SearchParams,
  AvailableVehicle,
  InsertBooking,
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>();
  const [vehicles, setVehicles] = useState<AvailableVehicle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<
    AvailableVehicle | undefined
  >();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (params: SearchParams) => {
    setIsSearching(true);
    setSearchParams(params);

    try {
      // todo: replace with actual API call
      console.log("Searching vehicles with params:", params);

      // Simulate API call
      const queryParams = new URLSearchParams({
        capacityRequired: params.capacityRequired.toString(),
        fromPincode: params.fromPincode,
        toPincode: params.toPincode,
        startTime: params.startTime,
      });

      const response = await fetch(
        `http://localhost:8000/api/v1/vehicles/available?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to search vehicles");
      }

      const result = await response.json();
      setVehicles(result);
    } catch (error) {
      console.error("Error searching vehicles:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search for vehicles. Please try again.",
        variant: "destructive",
      });
      setVehicles([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setIsBookingModalOpen(true);
    }
  };

  const handleConfirmBooking = async (booking: InsertBooking) => {
    try {
      // todo: replace with actual API call
      console.log("Confirming booking:", booking);

      // Simulate API call
      const response = await fetch("http://localhost:8000/api/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Vehicle is no longer available for this time slot");
        }
        throw new Error("Failed to create booking");
      }

      const result = await response.json();
      console.log("Booking created successfully:", result);

      toast({
        title: "Booking Successful",
        description: "Your vehicle has been booked successfully!",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to create booking. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Search & Book Vehicles</h1>
        <p className="text-muted-foreground mt-2">
          Find available vehicles for your logistics needs and book them
          instantly.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <VehicleSearch onSearch={handleSearch} isLoading={isSearching} />
        </div>

        <div>
          {searchParams && (
            <VehicleResults
              vehicles={vehicles}
              searchParams={searchParams}
              onBookVehicle={handleBookVehicle}
              isLoading={isSearching}
            />
          )}
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        vehicle={selectedVehicle}
        searchParams={searchParams}
        onConfirmBooking={handleConfirmBooking}
      />
    </div>
  );
}
