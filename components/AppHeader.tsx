import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useSidebar } from "../contexts/SidebarContext";

const TITLE = "My Calendars";

const AppHeader = () => {
  const { theme } = useTheme();
  const { openSidebar } = useSidebar();

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

const styles = StyleSheet.create({
  header: {
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
});
