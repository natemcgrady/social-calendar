import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useSidebar } from "../contexts/SidebarContext";

const TITLE = "My Calendars";

const AppHeader = () => {
  const { theme } = useTheme();
  const { openSidebar } = useSidebar();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          gap: theme.spacing.lg, // 16pt - standard spacing between header elements
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        },
        title: {
          fontSize: 20,
          fontWeight: "bold",
          flex: 1,
        },
      }),
    [theme.spacing.lg]
  );

  return (
    <View style={styles.header}>
      <Button variant="ghost" size="icon" onPress={openSidebar}>
        <Avatar>
          <AvatarImage source={require("../assets/avatar.png")} />
        </Avatar>
      </Button>
      <Text style={[styles.title, { color: theme.colors.foreground }]}>
        {TITLE}
      </Text>
    </View>
  );
};

export default AppHeader;
