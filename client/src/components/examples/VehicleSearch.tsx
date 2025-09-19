import { useState } from 'react';
import VehicleSearch from '../VehicleSearch';
import { VehicleSearch as SearchParams } from '@shared/schema';

export default function VehicleSearchExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchParams: SearchParams) => {
    console.log('Vehicle search submitted:', searchParams);
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return <VehicleSearch onSearch={handleSearch} isLoading={isLoading} />;
}