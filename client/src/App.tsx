import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import AddVehiclePage from "@/pages/AddVehiclePage";
import SearchPage from "@/pages/SearchPage";
import NotFound from "@/pages/not-found";

import AllVehiclesPage from "@/pages/AllVehiclesPage";
import AllBookingsPage from "@/pages/AllBookingsPage";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/add-vehicle" component={AddVehiclePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/all-vehicles" component={AllVehiclesPage} />
        <Route path="/all-bookings" component={AllBookingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light" storageKey="fleetlink-theme">
          <Toaster />
          <Router />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
