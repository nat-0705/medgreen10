import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import images from "@/constants/images";
import seed from "@/lib/seed";
import { Dimensions } from "react-native";


const GuestOrSignIn = () => {
//   const { refetch } = useGlobalContext();
  const { height, width } = Dimensions.get("window");

  const onSignInPress = async () => {
    router.replace("/sign-in");
  };

  const onContinueAsGuest = async () => {
    await AsyncStorage.setItem("guestSkipped", "true");
    router.replace("/home");
  };

  const onSeedPress = async () => {
    try {
      const result = await seed();
      console.log(result);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Image
          source={images.frontPlants}
          style={{
            marginTop: 20,
            width: "100%",
            height: height * 0.5,
          }}
          resizeMode="contain"
        />


        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome To MEDGREEN
          </Text>

          <Text className="text-2xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Healthy{"\n"}
            <Text className="text-primary-300">Using Medicinal Plants</Text>
          </Text>

          <View className="p-5">
            <CustomButton
              title="Sign-in as Administrator"
              onPress={onSignInPress}
              className="mt-6 bg-gray-500 w-full"
            />

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-3 text-gray-500 text-sm font-JakartaMedium">
                OR
              </Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <CustomButton
              title="Continue as Guest"
              onPress={onContinueAsGuest}
              className="bg-primary w-full"
            />
            {/* <CustomButton
              title="Continue as Guest"
              onPress={onSeedPress}
              className="bg-primary w-full"
            /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuestOrSignIn;
