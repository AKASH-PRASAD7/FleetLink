import { Booking } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "./ui/button";

interface BookingListProps {
  bookings: Booking[];
  isLoading: boolean;
  onCancelBooking?: (bookingId: string) => void;
}

export default function BookingList({ bookings, isLoading, onCancelBooking }: BookingListProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (bookings.length === 0) {
    return <div>No bookings found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking._id}</TableCell>
                <TableCell>{booking.customerId}</TableCell>
                <TableCell>{booking.fromPincode}</TableCell>
                <TableCell>{booking.toPincode}</TableCell>
                <TableCell>
                  {new Date(booking.startTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.endTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  {onCancelBooking && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onCancelBooking(booking._id!)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
