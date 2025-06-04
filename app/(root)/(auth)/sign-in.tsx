import { router } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { loginAdmin } from "@/lib/appwrite";
import { useGlobalContext, } from "@/lib/global-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";


const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { refetch } = useGlobalContext();

  const windowHeight = Dimensions.get("window").height;

  const onSignInPress = async () => {
    if (!form.email || !form.password) {
      return Alert.alert("Error", "Please enter both email and password.");
    }
  
    try {
      await loginAdmin(form.email, form.password);
      refetch();
      Alert.alert("Success", "Signed in successfully!");
      await AsyncStorage.removeItem("guestSkipped");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Invalid email or password. Try again.");
      console.error("Sign-in error:", error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white mt-10">
        {/* Image Section */}
        <View className="relative w-full" style={{ height: windowHeight * 0.35 }}>
          <Image
            source={images.signInPhoto}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.replace('/guest-or-sign-in')}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-2xl text-black font-rubik-semibold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        {/* Centered Form Section */}
        <View className="flex-1 px-8 justify-center items-center">
          <View className="w-full">
            <InputField
              label="Email"
              placeholder="Enter email"
              icon={icons.email}
              textContentType="emailAddress"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />

            <InputField
              label="Password"
              placeholder="Enter password"
              secureTextEntry={true}
              textContentType="password"
              icon={icons.lock}
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />

            <CustomButton
              title="Sign In"
              onPress={onSignInPress}
              className="mt-10 bg-primary w-full"
            />
          </View>
        </View>
      </View>
    </ScrollView>

  );
};

export default SignIn;
