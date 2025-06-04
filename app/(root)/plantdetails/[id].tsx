import PlantLocation from '@/components/PlantLocation';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { getPlantLocations, getPlantsByID } from "@/lib/appwrite";
import { useAppwrite } from '@/lib/useAppwrite';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PlantDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const windowHeight = Dimensions.get("window").height;

  const { data: plant, loading } = useAppwrite({
    fn: getPlantsByID,
    params: { id: id! },
  });

  const { data: locations } = useAppwrite({
    fn: getPlantLocations,
    params: { id: id }
  });

  const formatText = (text: any) => {
    if (!text) {
      return <Text className="text-black-200 text-base font-rubik mt-2">No content available.</Text>;
    }

    const parts = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g); 
    return parts.map((part: any, index: any) => {
      if (part.startsWith("***") && part.endsWith("***")) {
        return (
          <Text key={index} className="font-bold italic text-black-200 text-base font-rubik mt-2">
            {part.slice(3, -3)} 
          </Text>
        );
      } else if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={index} className="font-bold text-black-200 text-base font-rubik mt-2">
            {part.slice(2, -2)}
          </Text>
        );
      } else if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <Text key={index} className="italic text-black-200 text-base font-rubik mt-2">
            {part.slice(1, -1)}
          </Text>
        );
      } else {
        return (
          <Text key={index} className="text-black-200 text-base font-rubik mt-2">
            {part}
          </Text>
        );
      }
    });
  };

  const formatBullets = (text: any) => {
    if (!text) {
      return (
        <Text className="text-black-200 text-base font-rubik mt-2">
          No content available.
        </Text>
      );
    }

    const lines = text.split("\n");
    return lines.map((line: any, index : any) => {
      if (line.startsWith("- ")) {
        const bulletContent = line.slice(2); 
        const parts = bulletContent.split(/(\*\*.*?\*\*)/g);
        return (
          <View key={index} className="flex-row items-start mt-2">
            <Text className="mr-2 text-black-200 font-rubik">•</Text>
            <Text className="text-black-200 text-base font-rubik">
              {parts.map((part: any, i: any) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <Text key={i} className="font-bold">
                      {part.slice(2, -2)}
                    </Text>
                  );
                }
                return part;
              })}
            </Text>
          </View>
        );
      }

      return null;
    });
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="bg-white">
        <View className="flex-row items-center justify-between px-5 py-4 bg-white shadow-md">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex items-center justify-center size-10"
          >
            <Image source={icons.backArrow} className="size-6" />
          </TouchableOpacity>

          <Text className="text-lg font-rubik-bold text-black">Plant Details</Text>
          <View className="size-10" />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20 flex-grow"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: plant?.image_url }}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />
        </View>

        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            {plant?.name}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-base font-rubik-bold text-primary-300">
                {plant?.scientific_name}
              </Text>
            </View>
          </View>

          <View className="mt-7">
            <View className="flex flex-row items-center justify-start mt-4 mb-4 gap-2">
              <Image source={icons.details} className="w-7 h-7" />
              <Text className="text-black-300 text-xl font-rubik-bold">
                Plant Informations
              </Text>
            </View>
            <Text className="text-black-200 text-base font-rubik mt-2">
              <Text>{formatText(plant?.informations)}</Text>
            </Text>
          </View>

          <View className="mt-7">
            <View className="flex flex-row items-center justify-start mt-4 mb-4 gap-2">
              <Image source={icons.howToUse} className="w-7 h-7" />
              <Text className="text-black-300 text-xl font-rubik-bold">
                How to Use
              </Text>
            </View>
            <Text className="text-black-200 text-base font-rubik mt-2">
              <Text>{formatBullets(plant?.how_to_use)}</Text>
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Location
            </Text>
            <View className="flex flex-row items-center justify-start mt-4 mb-4 gap-2">
              <Image source={icons.location} className="w-7 h-7" />
              <Text className="text-black-200 text-sm font-rubik-medium">
                {plant?.name}
              </Text>
            </View>

            {loading ? (
              <View className="flex-1 justify-center items-center mt-5">
                <ActivityIndicator size="large" className="text-primary-300" />
              </View>
            ) : (
              <View className="h-[450px]">
                <PlantLocation locations={locations ?? []} disableMarkerPress={true} />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PlantDetails;
