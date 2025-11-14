import React from "react";
import { View, ViewStyle } from "react-native";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { useTheme } from "../../contexts/ThemeContext";

export interface CalendarMember {
  id?: string | number;
  name: string;
  avatarUrl?: string | number; // string for remote URLs, number for require() results
}

interface AvatarStackProps {
  members: CalendarMember[];
  maxAvatars?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
  style?: ViewStyle;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function AvatarStack({
  members,
  maxAvatars = 3,
  size = "md",
  style,
}: AvatarStackProps) {
  const { theme } = useTheme();
  const displayMembers = members.slice(0, maxAvatars);

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
  };

  const baseAvatarStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: theme.colors.background,
  };

  const overlappingAvatarStyle: ViewStyle = {
    ...baseAvatarStyle,
    marginLeft: -theme.spacing.sm, // -space-x-2 equivalent
  };

  return (
    <View style={[containerStyle, style]}>
      {displayMembers.map((member, index) => (
        <Avatar
          key={member.id || index}
          size={size}
          style={index === 0 ? baseAvatarStyle : overlappingAvatarStyle}
        >
          {member.avatarUrl ? (
            <AvatarImage
              source={
                typeof member.avatarUrl === "number"
                  ? member.avatarUrl
                  : { uri: member.avatarUrl }
              }
              alt={member.name}
            />
          ) : null}
          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
        </Avatar>
      ))}
    </View>
  );
}
