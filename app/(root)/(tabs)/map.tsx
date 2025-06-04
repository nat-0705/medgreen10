import PlantLocation from "@/components/PlantLocation";
import { getPlantLocations } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import React from 'react';
import { ActivityIndicator, SafeAreaView, View } from "react-native";

const Map = () => {
  const { data: locations, loading } = useAppwrite({
      fn: getPlantLocations,
  });

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
  )
}

export default Map