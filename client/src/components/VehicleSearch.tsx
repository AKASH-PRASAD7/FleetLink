import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Package, Calendar } from "lucide-react";
import { vehicleSearchSchema, type VehicleSearch } from "@shared/schema";

interface VehicleSearchProps {
  onSearch?: (searchParams: VehicleSearch) => Promise<void>;
  isLoading?: boolean;
}

export default function VehicleSearch({ onSearch, isLoading = false }: VehicleSearchProps) {
  const form = useForm<VehicleSearch>({
    resolver: zodResolver(vehicleSearchSchema),
    defaultValues: {
      capacityRequired: 0,
      fromPincode: "",
      toPincode: "",
      startTime: "",
    },
  });

  const handleSearch = async (data: VehicleSearch) => {
    if (onSearch) {
      await onSearch(data);
    } else {
      // Demo functionality
      console.log("Search parameters:", data);
    }
  };

  // Helper to format datetime-local input
  const formatDateForInput = (date: Date = new Date()) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Available Vehicles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-6" data-testid="form-vehicle-search">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromPincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      From Pincode
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 110001" 
                        {...field} 
                        data-testid="input-from-pincode"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toPincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      To Pincode
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 400001" 
                        {...field} 
                        data-testid="input-to-pincode"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="capacityRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Required Capacity (kg)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 500" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      data-testid="input-capacity-required"
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum cargo capacity needed for this booking
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Preferred Start Time
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field}
                      min={formatDateForInput()}
                      data-testid="input-start-time"
                    />
                  </FormControl>
                  <FormDescription>
                    When do you need the vehicle to be available?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full"
              data-testid="button-search-vehicles"
            >
              {isLoading ? "Searching..." : "Search Available Vehicles"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}