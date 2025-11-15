import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "../components/ui/sidebar";
import { useTheme } from "../contexts/ThemeContext";
import { Avatar, AvatarImage } from "./ui/avatar";
import ThemeToggle from "./ThemeToggle";
import { Theme } from "../constants/theme";
import membersData from "../db/members.json";

type SideNavProps = {
  isOpen: boolean;
  closeSidebar: () => void;
  dragTranslateX?: Animated.Value;
};

const SideNav = ({ isOpen, closeSidebar, dragTranslateX }: SideNavProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Get current user (assuming first member is current user)
  const currentUser = membersData.members[0];
  const friendCount = membersData.members.length - 1; // Exclude current user

  const handleProfilePress = () => {
    closeSidebar();
    router.push("/profile");
  };

  const handleSettingsPress = () => {
    closeSidebar();
    router.push("/settings");
  };

  return (
    <Sidebar
      open={isOpen}
      onClose={closeSidebar}
      dragTranslateX={dragTranslateX}
    >
      <SidebarHeader>
        <View style={styles.headerContent}>
          <Avatar size="xl">
            <AvatarImage source={require("../assets/avatar.png")} />
          </Avatar>
          <Text style={[styles.userName, { color: theme.colors.foreground }]}>
            {currentUser.name}
          </Text>
        </View>
      </SidebarHeader>
      <SidebarContent>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.menuSection}>
            <Pressable
              onPress={handleProfilePress}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: theme.colors.muted },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={theme.colors.foreground}
                style={styles.menuIcon}
              />
              <Text
                style={[styles.menuText, { color: theme.colors.foreground }]}
              >
                Profile
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                closeSidebar();
                router.push("/friends");
              }}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: theme.colors.muted },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={20}
                color={theme.colors.foreground}
                style={styles.menuIcon}
              />
              <Text
                style={[styles.menuText, { color: theme.colors.foreground }]}
              >
                Friends
              </Text>
              <View style={styles.badge}>
                <Text
                  style={[
                    styles.badgeText,
                    { color: theme.colors.primaryForeground },
                  ]}
                >
                  {friendCount}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleSettingsPress}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: theme.colors.muted },
              ]}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={theme.colors.foreground}
                style={styles.menuIcon}
              />
              <Text
                style={[styles.menuText, { color: theme.colors.foreground }]}
              >
                Settings
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    headerContent: {
      alignItems: "center",
      gap: theme.spacing.md,
    },
    userName: {
      fontSize: 18,
      fontWeight: "600",
      marginTop: theme.spacing.sm,
    },
    menuSection: {
      gap: theme.spacing.xs,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.md,
      gap: theme.spacing.md,
    },
    menuIcon: {
      width: 24,
    },
    menuText: {
      fontSize: 16,
      flex: 1,
    },
    badge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: 999,
      minWidth: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "600",
    },
  });
