import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';

import PlantLocation from '@/components/PlantLocation';
import { getPlantLocations } from '@/lib/appwrite';
import { usePlantStore } from '@/lib/plantStore';
import { useAppwrite } from '@/lib/useAppwrite';
const Map = () => {
  const { refreshKey } = usePlantStore();

  const {
    data: locations,
    loading,
    refetch,
  } = useAppwrite({
    fn: getPlantLocations,
  });

  useEffect(() => {
    refetch({});
  }, [refreshKey]);

  return (
    <SafeAreaView className="flex-1 justify-center">
      {loading ? (
        <View className="flex-1 items-center">
          <ActivityIndicator size="large" className="text-primary-300 mt-5" />
        </View>
      ) : (
        <PlantLocation locations={locations ?? []} />
      )}
    </SafeAreaView>
  );
};

export default Map;
