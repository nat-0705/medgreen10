import NoResults from "@/components/noResult";
import { Models } from "appwrite";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

interface Props {
  locations?: Models.Document[];
  disableMarkerPress?: boolean;
}

const PlantLocation = ({ locations = [], disableMarkerPress = false }: Props) => {
  const [selectedPlant, setSelectedPlant] = useState<Models.Document | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const handleMarkerPress = (location: Models.Document) => {
    console.log("Selected Plant:", location);
    setSelectedPlant(location);
    setModalVisible(true);
  };

  if (locations.length === 0) {
    return <NoResults />;
  }

  return (
    <View className="mt-4 h-full w-full rounded-lg overflow-hidden">
      <MapView
        style={{ height: "100%", width: "100%" }}
        initialRegion={
          initialRegion ?? {
            latitude: locations[0]?.latitude || 10.7392,
            longitude: locations[0]?.longitude || 124.7944,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {locations.map((location) => (
          <Marker
            key={location.$id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onPress={() => !disableMarkerPress && handleMarkerPress(location)}
            title={location?.plant_id?.name}
            description={location?.plant_id?.scientific_name}
          />
        ))}
    
      </MapView>

      {/* Modal for plant details */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-2xl w-[90%] shadow-lg shadow-black">
            {/* Image */}
            <View className="w-full h-40 bg-green-500 rounded-lg overflow-hidden">
              <Image
                source={{ uri: selectedPlant?.plant_id?.image_url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Plant Details */}
            <View className="mt-4">
              <Text className="text-lg font-bold text-green-800">
                {selectedPlant?.plant_id?.name || "No Name Available"}
              </Text>
              <Text className="font-rubik-italic text-sm text-green-700">
                {selectedPlant?.plant_id?.scientific_name || "Scientific name not available"}
              </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              className="mt-4 bg-green-500 p-2 rounded-md"
              onPress={() => {
                setModalVisible(false);
                router.push(`/plantdetails/${selectedPlant?.plant_id?.$id}`);
              }}
            >
              <Text className="text-white text-center">View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-2 bg-gray-300 p-2 rounded-md"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlantLocation;
