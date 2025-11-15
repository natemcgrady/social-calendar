import React, { useMemo } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/ui/button";
import { useTheme } from "../../contexts/ThemeContext";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Theme } from "../../constants/theme";
import membersData from "../../db/members.json";

export default function FriendProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const friendId = parseInt(id || "0", 10);
  const friend = membersData.members.find((member) => member.id === friendId);
  const currentUserId = membersData.members[0].id;

  // If friend not found or trying to view own profile, redirect
  if (!friend || friend.id === currentUserId) {
    router.back();
    return null;
  }

  const friendCount = membersData.members.length - 1; // All other members are friends

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.foreground}
          />
        </Button>
        <Text style={[styles.headerTitle, { color: theme.colors.foreground }]}>
          Profile
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Avatar size="xl">
            <AvatarImage
              source={
                friend.avatarUrl === "../assets/mel.jpg"
                  ? require("../../assets/mel.jpg")
                  : require("../../assets/avatar.png")
              }
            />
          </Avatar>
          <Text style={[styles.userName, { color: theme.colors.foreground }]}>
            {friend.name}
          </Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text
              style={[styles.statValue, { color: theme.colors.foreground }]}
            >
              {friendCount}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.mutedForeground }]}
            >
              Friends
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text
              style={[styles.statValue, { color: theme.colors.foreground }]}
            >
              {friend.calendarIds.length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.mutedForeground }]}
            >
              Calendars
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons
              name="person-outline"
              size={20}
              color={theme.colors.mutedForeground}
            />
            <Text style={[styles.infoLabel, { color: theme.colors.foreground }]}>
              Name
            </Text>
            <Text
              style={[styles.infoValue, { color: theme.colors.mutedForeground }]}
            >
              {friend.name}
            </Text>
          </View>
          {/* Email is not shown for friends - only visible to the user themselves */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600",
    },
    headerSpacer: {
      width: 40,
    },
    scrollContent: {
      padding: theme.spacing.lg,
      gap: theme.spacing.xl,
    },
    profileSection: {
      alignItems: "center",
      gap: theme.spacing.md,
    },
    userName: {
      fontSize: 24,
      fontWeight: "600",
    },
    statsSection: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    statCard: {
      flex: 1,
      alignItems: "center",
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      gap: theme.spacing.xs,
    },
    statValue: {
      fontSize: 32,
      fontWeight: "700",
    },
    statLabel: {
      fontSize: 14,
    },
    infoSection: {
      gap: theme.spacing.md,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    infoLabel: {
      fontSize: 16,
      flex: 1,
    },
    infoValue: {
      fontSize: 16,
    },
  });

