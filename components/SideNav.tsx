import React from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "../components/ui/sidebar";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, AvatarImage } from "./ui/avatar";
import ThemeToggle from "./ThemeToggle";

type SideNavProps = {
  isOpen: boolean;
  closeSidebar: () => void;
};

const SideNav = ({ isOpen, closeSidebar }: SideNavProps) => {
  const { theme } = useTheme();

  return (
    <Sidebar open={isOpen}>
      <SidebarHeader>
        <View style={styles.headerRow}>
          <Avatar size="xl">
            <AvatarImage source={require("../assets/avatar.png")} />
          </Avatar>
          <Button variant="ghost" size="icon-sm" onPress={closeSidebar}>
            <Ionicons name="close" size={20} color={theme.colors.foreground} />
          </Button>
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
