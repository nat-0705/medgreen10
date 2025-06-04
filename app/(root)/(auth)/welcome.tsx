import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import { plantProcess } from "@/constants/index";

import { useGlobalContext } from "@/lib/global-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const Welcome = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef<ICarouselInstance>(null);

    const isLastSlide = activeIndex === plantProcess.length - 1;

    const { isLogged, user, refetch } = useGlobalContext();

    useEffect(() => {
      const checkUserStatus = async () => {
        if (isLogged && user?.email === "admin@example.com") {
          router.replace("/home");
          return;
        }
  
        const guestSkipped = await AsyncStorage.getItem("guestSkipped");
        if (guestSkipped === "true") {
          router.replace("/guest-or-sign-in");
          // router.replace("/home");

        }
      };
  
      checkUserStatus();
    }, [isLogged, user]);

    const handleSkip = () => {
      router.replace("/guest-or-sign-in");
      // router.replace("/home");

    };

    const handleNext = () => {
      if (isLastSlide) {
        handleSkip();
      } else {
        carouselRef.current?.next();
      }
    };

  return (
    <SafeAreaView className="flex-1 items-center justify-between bg-white">
      <TouchableOpacity
        onPress={handleSkip}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-rubik-medium">Skip</Text>
      </TouchableOpacity>

      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={height * 0.6}
        data={plantProcess}
        scrollAnimationDuration={400}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              style={{ width: '100%', height: height * 0.35 }}
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        )}
        pagingEnabled
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center items-center mt-[-10px] mb-2">
        {plantProcess.map((_, index) => (
          <View
            key={index}
            className={`h-1 mx-1 rounded-full ${
              index === activeIndex ? "w-8 bg-primary-300" : "w-8 bg-gray-200"
            }`}
          />
        ))}
      </View>

      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={handleNext}
        className="mt-2 mb-5 w-9/12"
      />
    </SafeAreaView>
  );
};

export default Welcome;
