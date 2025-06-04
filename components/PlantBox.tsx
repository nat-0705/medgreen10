import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";
import { Models } from "appwrite";
import { router } from "expo-router";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

interface Props {
  plant?: Models.Document;
  onPress?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export const PlantBox = ({ plant, onPress, onDelete, isLoading }: Props) => {
  const { isLogged } = useGlobalContext();

  const handlePlantPress = (id: any) => router.push(`/plantdetails/editLocation/${id}`);

  const handleEdit = () => {
    if (plant?.$id) {
      router.push(`/plantdetails/editLocation/${plant.$id}`);
    }
  };

 return (
    <TouchableOpacity
      className="mt-5 mx-auto w-[90%] bg-white rounded-2xl shadow-lg shadow-black p-4 flex-row items-center"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="w-24 h-20 bg-green-500 rounded-lg overflow-hidden">
        <Image source={{ uri: plant?.image_url }} className="w-full h-full" resizeMode="cover" />
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold text-green-800">{plant?.name}</Text>
        <Text className="italic text-sm text-green-700">{plant?.scientific_name}</Text>
      </View>

      {isLogged && (
      <Menu>
        <MenuTrigger>
         <Text className="text-3xl font-bold px-4 py-2">⋮</Text>
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: { backgroundColor: "white", padding: 10 } }}>
          <MenuOption onSelect={() => handlePlantPress(plant?.$id)}>
            <View className="flex-row items-center gap-2 p-2">
              <Image source={icons.edit} className="size-6" />
              <Text className="text-black">Edit</Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={isLoading ? undefined : onDelete}>
            <View className="flex-row items-center gap-2 p-2">
              {isLoading ? (
                <ActivityIndicator size="small" color="red" />
              ) : (
                <>
                  <Image source={icons.bin} className="size-6" />
                  <Text className="text-red-500">Delete</Text>
                </>
              )}
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
      )}
    </TouchableOpacity>
  );
};
