import { useState, useEffect } from "react";
import { Booking } from "@shared/schema";
import BookingList from "@/components/BookingList";
import { useToast } from "@/hooks/use-toast";

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/v1/bookings");
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

  return (
    <div className="max-w-6xl h-screen mx-auto space-y-4">
      <div>
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Browse the complete list of bookings.
        </p>
      </div>
      <BookingList bookings={bookings} isLoading={isLoading} />
    </div>
  );
}
