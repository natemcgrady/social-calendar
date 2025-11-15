import React, { useMemo, useState } from "react";
import { StyleSheet, ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Theme } from "../constants/theme";
import { EditProfileModal } from "../components/EditProfileModal";
import membersData from "../db/members.json";

export default function Profile() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: membersData.members[0].name,
    email: "",
  });

  // Get current user (assuming first member is current user)
  const currentUser = membersData.members[0];
  const friendCount = membersData.members.length - 1;

  const handleSaveProfile = (profile: { name: string; email: string }) => {
    setUserProfile(profile);
    // In a real app, you would save this to a backend or local storage
  };

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
        <Button
          variant="ghost"
          size="icon"
          onPress={() => setIsEditModalVisible(true)}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color={theme.colors.foreground}
          />
        </Button>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Avatar size="xl">
            <AvatarImage source={require("../assets/avatar.png")} />
          </Avatar>
          <Text style={[styles.userName, { color: theme.colors.foreground }]}>
            {userProfile.name}
          </Text>
        </View>

        <View style={styles.statsSection}>
          <Pressable
            onPress={() => router.push("/friends")}
            style={({ pressed }) => [
              styles.statCard,
              pressed && { opacity: 0.7 },
            ]}
          >
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
          </Pressable>
          <View style={styles.statCard}>
            <Text
              style={[styles.statValue, { color: theme.colors.foreground }]}
            >
              {currentUser.calendarIds.length}
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
              {userProfile.name}
            </Text>
          </View>
          {userProfile.email && (
            <View style={styles.infoRow}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={theme.colors.mutedForeground}
              />
              <Text style={[styles.infoLabel, { color: theme.colors.foreground }]}>
                Email
              </Text>
              <Text
                style={[styles.infoValue, { color: theme.colors.mutedForeground }]}
              >
                {userProfile.email}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleSaveProfile}
        initialName={userProfile.name}
        initialEmail={userProfile.email}
      />
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

