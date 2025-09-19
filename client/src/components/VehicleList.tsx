import { Vehicle } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export default function VehicleList({ vehicles, isLoading }: VehicleListProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (vehicles.length === 0) {
    return <div>No vehicles found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Fleet</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Capacity (kg)</TableHead>
              <TableHead>Tyres</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.name}</TableCell>
                <TableCell>{vehicle.capacityKg}</TableCell>
                <TableCell>{vehicle.tyres}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
