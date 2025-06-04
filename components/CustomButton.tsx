import { Image, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: any
    IconRight?: any
    className?: string;
  }

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-[#255B3A]";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) => {
  // Determine text color based on variant
  const textColor = textVariant === "primary" ? "black" : "white";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-9/12 rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className}`}
      {...props}
    >
      {/* Left Icon */}
      {IconLeft && (
        <Image
          source={IconLeft}
          style={{ tintColor: textColor }}
          className="w-6 h-6 mr-2"
        />
      )}

      <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
        {title}
      </Text>

      {/* Right Icon */}
      {IconRight && (
        <Image
          source={IconRight}
          style={{ tintColor: textColor }}
          className="w-6 h-6 ml-2"
        />
      )}
    </TouchableOpacity>
  );
};


export default CustomButton;