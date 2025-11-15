import React, { useMemo } from "react";
import { StyleSheet, ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Theme } from "../constants/theme";
import membersData from "../db/members.json";

export default function Friends() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Get current user (assuming first member is current user)
  const currentUserId = membersData.members[0].id;
  const friends = membersData.members.filter(
    (member) => member.id !== currentUserId
  );

  const handleFriendPress = (friendId: number) => {
    router.push(`/friend/${friendId}`);
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
          Friends
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {friends.length > 0 ? (
          <View style={styles.friendsList}>
            {friends.map((friend) => (
              <Pressable
                key={friend.id}
                onPress={() => handleFriendPress(friend.id)}
                style={({ pressed }) => [
                  styles.friendItem,
                  pressed && { backgroundColor: theme.colors.muted },
                ]}
              >
                <Avatar size="lg">
                  <AvatarImage
                    source={
                      friend.avatarUrl === "../assets/mel.jpg"
                        ? require("../assets/mel.jpg")
                        : require("../assets/avatar.png")
                    }
                  />
                </Avatar>
                <View style={styles.friendInfo}>
                  <Text
                    style={[styles.friendName, { color: theme.colors.foreground }]}
                  >
                    {friend.name}
                  </Text>
                  <Text
                    style={[
                      styles.friendCalendars,
                      { color: theme.colors.mutedForeground },
                    ]}
                  >
                    {friend.calendarIds.length} calendar
                    {friend.calendarIds.length !== 1 ? "s" : ""}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.mutedForeground}
                />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="people-outline"
              size={64}
              color={theme.colors.mutedForeground}
            />
            <Text
              style={[styles.emptyText, { color: theme.colors.mutedForeground }]}
            >
              No friends yet
            </Text>
          </View>
        )}
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
    },
    friendsList: {
      gap: theme.spacing.sm,
    },
    friendItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      gap: theme.spacing.md,
    },
    friendInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    friendName: {
      fontSize: 16,
      fontWeight: "500",
    },
    friendCalendars: {
      fontSize: 14,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing["3xl"],
      gap: theme.spacing.md,
    },
    emptyText: {
      fontSize: 16,
    },
  });

