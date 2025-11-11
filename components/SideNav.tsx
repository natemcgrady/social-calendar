import React from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "../components/ui/sidebar";
import { useTheme } from "../contexts/ThemeContext";
import { Avatar, AvatarImage } from "./ui/avatar";
import ThemeToggle from "./ThemeToggle";

type SideNavProps = {
  isOpen: boolean;
  closeSidebar: () => void;
  dragTranslateX?: Animated.Value;
};

const SideNav = ({ isOpen, closeSidebar, dragTranslateX }: SideNavProps) => {
  const { theme } = useTheme();

  return (
    <Sidebar
      open={isOpen}
      onClose={closeSidebar}
      dragTranslateX={dragTranslateX}
    >
      <SidebarHeader>
        <View style={styles.headerRow}>
          <Avatar size="xl">
            <AvatarImage source={require("../assets/avatar.png")} />
          </Avatar>
        </View>
      </SidebarHeader>
      <SidebarContent>
        <Text style={[styles.sidebarText, { color: theme.colors.foreground }]}>
          Settings
        </Text>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sidebarText: {
    fontSize: 16,
  },
});
