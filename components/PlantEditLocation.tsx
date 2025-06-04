import { Models } from "appwrite";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";

interface Props {
  locations?: Models.Document[];
  onLocationsChange: (locations: LatLng[]) => void;
}

const PlantEditLocation = ({ locations = [], onLocationsChange }: Props) => {
  const [markers, setMarkers] = useState<LatLng[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const initialMarkers = locations.map((loc) => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
    }));
    setMarkers(initialMarkers);
  }, [locations]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentPosition.coords;

      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newMarkers = [...markers, { latitude, longitude }];
    setMarkers(newMarkers);
    onLocationsChange(newMarkers);
  };

  const handleMarkerPress = (index: number) => {
    const updatedMarkers = markers.filter((_, i) => i !== index);
    setMarkers(updatedMarkers);
    onLocationsChange(updatedMarkers);
  };

  return (
    <View className="mt-4 h-full w-full rounded-lg overflow-hidden">
      <MapView
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        showsUserLocation
        showsMyLocationButton
        onPress={handleMapPress}
        initialRegion={{
          latitude: locations[0]?.latitude || 10.7392,
          longitude: locations[0]?.longitude || 124.7944,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            title={`Location ${index + 1}`}
            description="Tap to remove"
            onPress={() => handleMarkerPress(index)}
          />
        ))}
      </MapView>
    </View>
  );
};

export default PlantEditLocation;
