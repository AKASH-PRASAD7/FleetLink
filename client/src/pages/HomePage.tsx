import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Search, MapPin, Package, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to FleetLink
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional logistics vehicle booking platform for B2B operations.
          Manage your fleet, check availability, and handle bookings
          efficiently.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Register a new vehicle in your fleet with capacity,
              specifications, and operational details.
            </p>
            <Link href="/add-vehicle">
              <Button className="w-full" data-testid="button-add-vehicle">
                Add Vehicle
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search & Book
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Find available vehicles based on capacity, route, and timing
              requirements.
            </p>
            <Link href="/search">
              <Button className="w-full" data-testid="button-search-book">
                Search Vehicles
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Platform Features</h2>
          <p className="text-muted-foreground">
            Comprehensive logistics management tools for efficient fleet
            operations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fleet Management</h3>
                <p className="text-sm text-muted-foreground">
                  Add and manage vehicles with detailed specifications and
                  capacity information.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Route Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Smart pincode-based route calculation with estimated duration
                  and availability.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Real-time Booking</h3>
                <p className="text-sm text-muted-foreground">
                  Instant availability checks and conflict-free booking with
                  time validation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">System Status</h3>
              <p className="text-sm text-muted-foreground">
                All systems operational and ready for logistics management
              </p>
            </div>
            <Badge
              className="bg-green-100 text-green-800 hover:bg-green-100"
              data-testid="badge-system-status"
            >
              Online
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
