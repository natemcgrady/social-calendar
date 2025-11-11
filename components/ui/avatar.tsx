import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  size?: AvatarSize | number;
}

interface AvatarImageProps {
  source: { uri: string } | number;
  style?: ImageStyle;
  alt?: string;
}

interface AvatarFallbackProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

function Avatar({ children, style, size = "md" }: AvatarProps) {
  const { theme } = useTheme();

  // Map size strings to pixel values based on theme spacing
  const getSizeValue = (size: AvatarSize | number): number => {
    if (typeof size === "number") {
      return size;
    }

    const sizeMap: Record<AvatarSize, number> = {
      xs: theme.spacing.xs * 4, // 16 (4x spacing.xs)
      sm: theme.spacing["2xl"], // 24
      md: theme.spacing["3xl"], // 32 (matches current default)
      lg: theme.spacing["4xl"], // 40
      xl: theme.spacing["5xl"], // 48
      "2xl": theme.spacing["3xl"] * 2, // 64
    };

    return sizeMap[size];
  };

  const sizeValue = getSizeValue(size);
  const avatarStyle: ViewStyle = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
  };

  return (
    <View style={[avatarStyle, style]} data-slot="avatar">
      {children}
    </View>
  );
}

function AvatarImage({ source, style, alt }: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const imageStyle: ImageStyle = {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    position: "relative",
    zIndex: 1,
  };

  if (hasError) {
    return null;
  }

  return (
    <Image
      source={source}
      style={[imageStyle, style]}
      onError={() => setHasError(true)}
      accessibilityLabel={alt}
      data-slot="avatar-image"
    />
  );
}

function AvatarFallback({ children, style }: AvatarFallbackProps) {
  const { theme } = useTheme();

  const fallbackStyle: ViewStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999, // Full circle
  };

  // Dynamic font size based on parent avatar size
  // This will be calculated relative to the avatar size
  const textStyle: TextStyle = {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    fontWeight: "500",
  };

  return (
    <View style={[fallbackStyle, style]} data-slot="avatar-fallback">
      {typeof children === "string" ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
