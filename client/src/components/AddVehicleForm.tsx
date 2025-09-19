import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Truck, Package, CircleDot } from "lucide-react";
import { insertVehicleSchema, type InsertVehicle } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface AddVehicleFormProps {
  onSubmit?: (vehicle: InsertVehicle) => Promise<void>;
}

export default function AddVehicleForm({ onSubmit }: AddVehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertVehicle>({
    resolver: zodResolver(insertVehicleSchema),
    defaultValues: {
      name: "",
      capacityKg: 0,
      tyres: 4,
    },
  });

  const handleSubmit = async (data: InsertVehicle) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
        toast({
          title: "Vehicle Added",
          description: `${data.name} has been successfully added to the fleet.`,
        });
        form.reset();
      } else {
        // Demo functionality
        console.log("Vehicle submitted:", data);
        toast({
          title: "Vehicle Added",
          description: `${data.name} has been successfully added to the fleet.`,
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Add New Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" data-testid="form-add-vehicle">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Fleet-001, Delivery Truck A" 
                      {...field} 
                      data-testid="input-vehicle-name"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a unique identifier for this vehicle
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacityKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Capacity (kg)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 1000" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      data-testid="input-vehicle-capacity"
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum load capacity in kilograms
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tyres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CircleDot className="h-4 w-4" />
                    Number of Tyres
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 4, 6, 10" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      data-testid="input-vehicle-tyres"
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of tyres on the vehicle
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full"
              data-testid="button-submit-vehicle"
            >
              {isSubmitting ? "Adding Vehicle..." : "Add Vehicle to Fleet"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}