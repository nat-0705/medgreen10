import CustomButton from "@/components/CustomButton";
import PlantEditOrAddLocation from "@/components/PlantEditOrAddLocation";
import { editSteps } from "@/constants/editSteps";
import icons from "@/constants/icons";
import {
  createMedicinalPlant,
  createPlantLocation,
  getPlantLocations,
  getPlantsByID,
  updatePlant,
  updatePlantLocation,
  uploadPlantImage,
} from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import * as ImagePicker from "expo-image-picker";
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

const EditOrAddPlant = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [locationsPlant, setLocationsPlant] = useState<LatLng[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const [plantDetails, setPlantDetails] = useState<{
    name: string,
    scientificName: string,
    commonName: string;
    informations: string;
    howToUse: string;
    plantImage: ImagePicker.ImagePickerAsset | string | null;
  }>({
    name: "",
    scientificName: "",
    commonName: "",
    informations: "",
    howToUse: "",
    plantImage: null,
  });

  const displayImageUri =
    typeof plantDetails.plantImage === "string"
      ? plantDetails.plantImage
      : plantDetails.plantImage?.uri || null;

  const { data: plant, loading: loadingPlant } = useAppwrite({
    fn: getPlantsByID,
    params: { id: id! },
    skip: id === "new",
  });

  const { data: locations, loading: loadingLocations } = useAppwrite({
    fn: getPlantLocations,
    params: { id },
    skip: id === "new",
  });

  useEffect(() => {
    if (plant && id !== "new") {
      setPlantDetails({
        name: plant.name || "",
        scientificName: plant.scientific_name || "",
        commonName: plant.common_name || "",
        howToUse: plant.how_to_use || "",
        informations: plant.informations || "",
        plantImage: plant.image_url || null,
      });
    }
  }, [plant, id]);

  useEffect(() => {
    if (id !== "new" && locations) {
      const latLngLocations = locations.map((doc) => ({
        latitude: doc.latitude,
        longitude: doc.longitude,
      }));
      setLocationsPlant(latLngLocations);
    } else {
      setLocationsPlant([]);
    }
  }, [locations, id]);


  const handleChange = (key: keyof typeof plantDetails, value: any) => {
    console.log("handleChange called with", key, value);
    setPlantDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);

      let imageUrl: string | null = null;

      if (typeof plantDetails.plantImage === "string") {
        imageUrl = plantDetails.plantImage;
      } else if (
        plantDetails.plantImage &&
        typeof plantDetails.plantImage.uri === "string" &&
        plantDetails.plantImage.uri.startsWith("file://")
      ) {
        imageUrl = await uploadPlantImage(
          plantDetails.plantImage as ImagePicker.ImagePickerAsset
        );
      }

      if (id === "new") {
        const newPlant = await createMedicinalPlant({
          name: plantDetails.name,
          scientific_name: plantDetails.scientificName, 
          common_name: plantDetails.commonName,
          how_to_use: plantDetails.howToUse,
          informations: plantDetails.informations,
          image_url: imageUrl,
        });

        if (newPlant && locationsPlant.length > 0) {
          for (const loc of locationsPlant) {
            await createPlantLocation({
              plant_id: newPlant.$id,
              latitude: loc.latitude,
              longitude: loc.longitude,
            });
          }
        }

        Alert.alert("Success", "New plant created successfully!");
        router.push("/plant");
      } else {
        if (!id) return;

        const updateLocation = await updatePlantLocation(id, locationsPlant);
        const updateInfo = await updatePlant(
          id,
          plantDetails.name,
          plantDetails.scientificName,
          plantDetails.commonName,
          plantDetails.informations,
          plantDetails.howToUse,
          imageUrl
        );

        if (updateLocation && updateInfo) {
          Alert.alert("Success", "Updated plant data successfully!");
          router.push("/plant");
        } else {
          Alert.alert("Error", "Failed to update data. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting plant:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleChange("plantImage", result.assets[0]);
    }
  };

  if (loadingPlant && id !== "new") {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="mt-2 text-gray-600">Loading plant data...</Text>
      </View>
    );
  }

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
          {id === "new" ? "Add Medicinal Plant" : "Edit Medicinal Plant"}
        </Text>

        <View className="size-10" />
      </View>

      {/* Carousel */}
      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={height * 0.75}
        data={editSteps}
        scrollAnimationDuration={400}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View className="px-6 flex-1">
            {/* Instructions */}
            <View className="w-full">
              <Text className="text-md font-rubik-semibold text-black mb-2">
                INSTRUCTIONS
              </Text>
              {item.instructions.map((instruction, idx) => (
                <Text
                  key={idx}
                  className="text-gray-700 font-rubik-regular text-sm pl-4 mb-2"
                >
                  <Text className="font-rubik-bold">{idx + 1}.</Text> {instruction}
                </Text>
              ))}
            </View>

            {item.key === "name" && (
              <>
                <Text className="text-md font-rubik-semibold text-black mb-2 mt-2">
                  Plant Name
                </Text>

                <TextInput
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black"
                  multiline
                  numberOfLines={4}
                  value={plantDetails.name}
                  onChangeText={(text) => handleChange("name", text)}
                  placeholder={item.placeholder}
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
                
                <Text className="text-md font-rubik-semibold text-black mb-2 mt-8">
                  Scientific Name
                </Text>

                <TextInput
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black"
                  multiline
                  numberOfLines={4}
                  value={plantDetails.scientificName}
                  onChangeText={(text) => handleChange("scientificName", text)}
                  placeholder={item.placeholder}
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
              </>
            )}

            {item.key === "visuals" && (
              <>
                <Text className="text-md font-rubik-semibold text-black mb-2 mt-2">
                  Plant Image
                </Text>

                <TouchableOpacity
                  onPress={pickImage}
                  className="w-36 h-32 mb-6 border border-gray-300 rounded-lg justify-center items-center overflow-hidden self-center"
                >
                  {displayImageUri ? (
                    <Image
                      source={{ uri: displayImageUri }} 
                      style={{ width: 200, height: 200 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-gray-500 text-center px-2 text-sm">
                      Tap to upload
                    </Text>
                  )}
                </TouchableOpacity>

                <Text className="text-md font-rubik-semibold text-black mb-2">
                  Common Name
                </Text>

                <TextInput
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black flex-grow"
                  multiline
                  numberOfLines={4}
                  value={plantDetails.commonName}
                  onChangeText={(text) => handleChange("commonName", text)}
                  placeholder={item.placeholder}
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
              </>
            )}

            {item.key === "info" && (
              <>
                <Text className="text-md font-rubik-semibold text-black mb-2 mt-2">
                  Information of the Plant
                </Text>

                <TextInput
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black flex-grow"
                  multiline
                  numberOfLines={8}
                  value={plantDetails.informations}
                  onChangeText={(text) => handleChange("informations", text)}
                  placeholder={item.placeholder.toString()}
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
              </>
            )}

            {item.key === "usage" && (
              <>
                <Text className="text-md font-rubik-semibold text-black mb-2 mt-2">
                  How to Use
                </Text>

                <TextInput
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-black flex-grow"
                  multiline
                  numberOfLines={10}
                  value={plantDetails.howToUse}
                  onChangeText={(text) => handleChange("howToUse", text)}
                  placeholder={item.placeholder.toString()}
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
              </>
            )}

            {item.key === "location" && (
              <View className="w-full mb-6 flex-1">
                {loadingLocations ? (
                  <ActivityIndicator size="large" color="#4CAF50" />
                ) : (
                  <View
                    className="w-full border border-gray-400 rounded-lg overflow-hidden flex-1"
                    style={{ height: height * 0.5 }}
                  >
                    <PlantEditOrAddLocation
                      locations={locationsPlant}
                      onLocationsChange={setLocationsPlant}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      />

      {/* Pagination */}
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

      {/* Button */}
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

export default EditOrAddPlant;
