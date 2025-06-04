import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import icons from "@/constants/icons";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View className="flex-1 mt-2 flex flex-col items-center justify-center">
    <Image
      source={icon}
      tintColor={focused ? "#008000" : "#666876"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused ? "text-green-700 font-rubik-medium" : "text-black-200 font-rubik"
      } text-xs text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#E0E0E0",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 80 + insets.bottom : 60,
          paddingBottom: insets.bottom || 10,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.map} title="Map" />
          ),
        }}
      />
      <Tabs.Screen
        name="plant"
        options={{
          title: "Plant",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.plant} title="Plant" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
