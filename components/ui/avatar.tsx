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

interface AvatarProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  size?: number;
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

function Avatar({ children, style, size = 32 }: AvatarProps) {
  const avatarStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
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
