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
          <Text
            style={[styles.sidebarTitle, { color: theme.colors.foreground }]}
          >
            Menu
          </Text>
          <Button variant="ghost" size="icon-sm" onPress={closeSidebar}>
            <Ionicons name="close" size={20} color={theme.colors.foreground} />
          </Button>
        </View>
      </SidebarHeader>
      <SidebarContent>
        <Text style={[styles.sidebarText, { color: theme.colors.foreground }]}>
          Sidebar content goes here
        </Text>
      </SidebarContent>
      <SidebarFooter>
        <Text
          style={[styles.sidebarText, { color: theme.colors.mutedForeground }]}
        >
          Footer content
        </Text>
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
