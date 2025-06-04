import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CustomButton from "@/components/CustomButton";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getPlants, logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

const { width, height } = Dimensions.get("window");
const API_URL = "https://nat0705-medicinal-plant-api.hf.space";

export default function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { refetch, isLogged } = useGlobalContext();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logout();
            refetch();
            await AsyncStorage.removeItem("guestSkipped");
            router.push("/guest-or-sign-in");
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow camera access.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      sendImageToHuggingFace(uri);
    }
  };

  const sendImageToHuggingFace = async (imageUri: string) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "plant.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        Alert.alert("Prediction Error", data.error);
      } else {
        const plants = await getPlants({ query: data.plant, limit: 1 });

        if (plants.length > 0) {
          const plantId = plants[0].$id;
          router.push(`/plantdetails/${plantId}`);
        } else {
          Alert.alert("Plant not found", "The predicted plant does not exist in the database.");
        }

       Alert.alert(
          'Prediction Result',
          `The model identified the plant as ${data.plant.toUpperCase()} with a confidence of ${data.confidence.toFixed(2)}%.`
        );

      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to connect to the Hugging Face server.");
    }
  };

  const onBackPress = async () => {
    await AsyncStorage.removeItem("guestSkipped");
    router.replace("/welcome");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={{ paddingTop: StatusBar.currentHeight || 40 }} className="px-6 pb-3 bg-white">
          <View className="flex-row items-center justify-between w-full">
            {!isLogged ? (
              <TouchableOpacity className="p-2" onPress={onBackPress}>
                <Image source={icons.backArrow} className="w-6 h-6" resizeMode="contain" />
              </TouchableOpacity>
            ) : (
              <View className="w-6" />
            )}

            {isLogged && (
              <TouchableOpacity className="p-2" onPress={handleLogout}>
                <Image source={icons.logout} className="w-7 h-7" resizeMode="contain" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Logo */}
        <View className="items-center mt-6">
          <Image
            source={images.logo}
            style={{ width: width * 0.6, height: height * 0.2 }}
            resizeMode="contain"
          />
        </View>

        {/* Process Section */}
        <View
          style={{
            width: width * 0.9,
            backgroundColor: "white",
            borderRadius: 35,
            marginTop: 30,
          }}
          className="mx-auto shadow-md px-6 py-5"
        >
          <Text className="text-green-800 text-base font-bold text-center">
            Discover the Medicinal Plants
          </Text>

          <View className="flex-row items-center justify-between mt-6">
            <Image source={images.qr} resizeMode="contain" className="w-10 h-10" />
            <Image source={images.next} resizeMode="contain" className="w-5 h-9" />
            <Image source={images.paper} resizeMode="contain" className="w-14 h-14" />
            <Image source={images.next} resizeMode="contain" className="w-5 h-9" />
            <Image source={images.healthcare} resizeMode="contain" className="w-14 h-14" />
          </View>

          <CustomButton
            title="Take a Photo"
            onPress={openCamera}
            className="mt-5 w-full"
            IconLeft={icons.photography}
          />
        </View>

        {/* Loading Overlay */}
        {loading && (
          <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center bg-black/50 z-50">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white mt-2">Processing Image...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
