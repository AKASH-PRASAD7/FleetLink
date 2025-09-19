import { useState, useEffect } from "react";
import { Booking } from "@shared/schema";
import BookingList from "@/components/BookingList";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/api";

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // ... (rest of the file)

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/v1/bookings`);
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to fetch bookings. Please try again later.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    fetchBookings();
  }, [toast]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );

      toast({
        title: "Success",
        description: "Booking canceled successfully.",
      });
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl h-screen mx-auto space-y-4">
      <div>
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Browse the complete list of bookings.
        </p>
      </div>
      <BookingList
        bookings={bookings}
        isLoading={isLoading}
        onCancelBooking={handleCancelBooking}
      />
    </div>
  );
}
