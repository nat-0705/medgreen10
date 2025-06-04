import CustomButton from "@/components/CustomButton";
import PlantEditLocation from "@/components/PlantEditLocation";
import icons from "@/constants/icons";
import {
  getPlantLocations,
  getPlantsByID,
  updatePlant,
  updatePlantLocation,
} from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LatLng } from "react-native-maps";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

const editSteps = [
  { key: "info", title: "Plant Information" },
  { key: "usage", title: "How to Use the Medicinal Plant" },
  { key: "location", title: "Medicinal Plant Location" },
];

const EditPlantLocation = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [locationsPlant, setLocationsPlant] = useState<LatLng[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [usage, setUsage] = useState("");
  const [informations, setInformations] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const { data: plant, loading } = useAppwrite({
    fn: getPlantsByID,
    params: { id: id! },
  });

  const { data: locations } = useAppwrite({
    fn: getPlantLocations,
    params: { id },
  });

  useEffect(() => {
    console.log("Fetched plant:", plant);

    // Check if data is inverted and fix accordingly
    if (plant?.informations) {
      setInformations(plant.informations);
    }
    if (plant?.how_to_use) {
      setUsage(plant.how_to_use);
    }
  }, [plant]);

  const handleSubmit = async () => {
    if (!id) return;

    try {
      setLoadingSubmit(true);
      const updateLocation = await updatePlantLocation(id, locationsPlant);
      const updateInfo = await updatePlant(id, informations, usage);
      if (updateLocation && updateInfo) {
        Alert.alert("Success", "Updated plant data successfully!");
        router.push("/plant");
      } else {
        Alert.alert("Error", "Failed to update data. Please try again.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <View className="flex-1 bg-white mt-5">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex items-center justify-center size-10"
        >
          <Image source={icons.backArrow} className="size-6" />
        </TouchableOpacity>

        <Text className="text-lg font-rubik-bold text-black">
          Edit Medicinal Plant
        </Text>

        <View className="size-10" />
      </View>

      {/* Carousel for editing steps */}
      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={height * 0.75}
        data={editSteps}
        scrollAnimationDuration={400}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => {
          if (item.key === "info") {
            return (
              <View className="px-6 flex-1">
                {/* Instruction */}
                <View className="w-full">
                  <Text className="text-md font-rubik-semibold text-black mb-2">INSTRUCTIONS</Text>
                  <Text className="text-gray-700 font-rubik-regular text-sm pl-4 mb-2">
                    <Text className="font-rubik-bold">1.</Text> Wrap text with <Text className="font-rubik-bold">*single asterisk*</Text> to make it <Text className="italic">italic</Text>.
                  </Text>
                  <Text className="text-gray-700 font-rubik-regular text-sm pl-4 mb-2">
                    <Text className="font-rubik-bold">2.</Text> Wrap text with <Text className="font-rubik-bold">**double asterisks**</Text> to make it <Text className="font-bold">bold</Text>.
                  </Text>
                  <Text className="text-gray-700 font-rubik-regular text-sm pl-4 mb-4">
                    <Text className="font-rubik-bold">3.</Text> Wrap text with <Text className="font-rubik-bold">***triple asterisks***</Text> to make it <Text className="italic font-bold">bold and italic</Text>.
                  </Text>
                </View>

                {/* Input title */}
                <Text className="text-md font-rubik-semibold text-black mb-2 mt-10">
                  {item.title}
                </Text>

                {/* Text input */}
                <TextInput
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black flex-grow"
                  multiline
                  numberOfLines={8}
                  value={informations}
                  onChangeText={setInformations}
                  placeholder="Enter basic information about this plant..."
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
              </View>
            );
          } else if (item.key === "usage") {
            return (
              <View className="px-6 flex-1">
                {/* Instruction */}
                <View className="w-full">
                  <Text className="text-md font-rubik-semibold text-black mb-2">INSTRUCTIONS</Text>
                  <Text className="text-gray-700 font-rubik-regular text-sm pl-4 mb-2">
                    <Text className="font-rubik-bold">1.</Text> Start each line with <Text className="font-rubik-bold">"- "</Text> to create a bullet point.
                  </Text>
                  <Text className="text-gray-700 font-rubik-regular text-sm pl-4 mb-2">
                    <Text className="font-rubik-bold">2.</Text> Use <Text className="font-rubik-bold">**double asterisks**</Text> to make text bold within a bullet.
                  </Text>
                </View>

                {/* Input title */}
                <Text className="text-md font-rubik-semibold text-black mb-2 mt-10">
                  {item.title}
                </Text>

                {/* Text input */}
                <TextInput
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black flex-grow"
                  multiline
                  numberOfLines={10}
                  value={usage}
                  onChangeText={setUsage}
                  placeholder="Describe how this plant is used medicinally..."
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
              </View>
            );
          } else if (item.key === "location") {
            return (
              <View className="px-6 flex-1">
                {/* Instruction */}
                <View className="w-full">
                  <Text className="text-md font-rubik-semibold text-black mb-2">INSTRUCTIONS</Text>
                  <Text className="text-gray-700 font-rubik-regular text-sm pl-4 mb-2">
                    <Text className="font-rubik-bold">1.</Text> Tap the map to add a marker.
                  </Text>
                  <Text className="text-gray-700 font-rubik-regular text-sm pl-4 mb-4">
                    <Text className="font-rubik-bold">2.</Text> Tap an existing marker to remove it.
                  </Text>
                </View>

                {/* Input title */}
                <Text className="text-md font-rubik-semibold text-black mb-2 mt-10">
                  {item.title}
                </Text>

                {/* Map Input */}
                <View className="w-full mb-6 flex-1">
                  {loading ? (
                    <ActivityIndicator size="large" color="#4CAF50" />
                  ) : (
                    <View
                      className="w-full border border-gray-400 rounded-lg overflow-hidden flex-1"
                      style={{ height: height * 0.5 }}
                    >
                      <PlantEditLocation
                        locations={locations ?? []}
                        onLocationsChange={(updated: LatLng[]) =>
                          setLocationsPlant(updated)
                        }
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          }
          return <View />;
        }}
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center items-center mt-4 mb-2">
        {editSteps.map((_, index) => (
          <View
            key={index}
            className={`h-1 mx-1 rounded-full ${
              index === activeIndex ? "w-8 bg-primary-300" : "w-8 bg-gray-200"
            }`}
          />
        ))}
      </View>

      {/* Next / Save Button */}
      <View className="px-6 mb-5">
        <CustomButton
          title={activeIndex === editSteps.length - 1 ? "Save" : "Next"}
          onPress={() => {
            if (activeIndex === editSteps.length - 1) {
              handleSubmit();
            } else {
              carouselRef.current?.next();
            }
          }}
          disabled={loadingSubmit}
          className={`w-full flex-row justify-center items-center ${
            loadingSubmit ? "bg-gray-400" : "bg-primary"
          }`}
        >
          {loadingSubmit && (
            <ActivityIndicator size="small" color="white" className="ml-2" />
          )}
        </CustomButton>
      </View>
    </View>
  );
};

export default EditPlantLocation;
