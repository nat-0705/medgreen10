import NoResults from "@/components/noResult";
import { PlantBox } from "@/components/PlantBox";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { deletePlantWithLocations, getPlants } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Plant = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const handlePlantPress = (id: string) => router.push(`/plantdetails/${id}`);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: planters, refetch, loading } = useAppwrite({
    fn: getPlants,
    params: {
      filter: params.filter ?? "All",
      query: params.query ?? "",
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter ?? "All",
      query: params.query ?? "",
    });
  }, [params.query, params.filter]);

  const handleDelete = (plantId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this plant?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            setDeletingId(plantId);
            Alert.alert("Deleting...", "Please wait while the plant is being deleted.");

            try {
              const success = await deletePlantWithLocations(plantId);

              if (success) {
                Alert.alert("Success", "Deleted Successfully!");
                refetch({
                  filter: params.filter ?? "All",
                  query: params.query ?? "",
                });
              } else {
                Alert.alert("Error", "Failed to delete plant. Please try again.");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Something went wrong!");
            }

            setDeletingId(null);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-6 bg-white pb-3">
        <View className="flex flex-row items-center justify-between mt-5">
          <Image source={icons.logoSmall} className="w-12 h-12" resizeMode="contain" />
          <Text className="text-lg font-bold text-green-800 text-center flex-1">
            Medicinal Plants
          </Text>
          <Image source={icons.logoSmall} className="w-12 h-12" resizeMode="contain" />
        </View>

        {/* Search Component Below Header */}
        <Search />
      </View>

      <FlatList
        data={planters}
        renderItem={({ item }: any) => (
          <PlantBox
            plant={item}
            onPress={() => handlePlantPress(item.$id)}
            onDelete={() => handleDelete(item.$id)}
            isLoading={deletingId === item.$id}
          />
        )}
        keyExtractor={(item: any) => item.$id}
        contentContainerClassName="pb-32 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
      />
    </SafeAreaView>
  );
};

export default Plant;
