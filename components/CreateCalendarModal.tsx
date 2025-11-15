import React, { useState, useMemo, useRef } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

interface Friend {
  id: string | number;
  name: string;
  email: string;
  avatarUrl?: string | number;
}

interface InvitedPerson {
  id: string;
  name: string;
  email: string;
  type: "friend" | "email";
  avatarUrl?: string | number;
}

interface CreateCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

// Mock friends data - in production this would come from a friends list
const MOCK_FRIENDS: Friend[] = [
  {
    id: 1,
    name: "Amelia McGrady",
    email: "amelia@example.com",
    avatarUrl: require("../assets/mel.jpg"),
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    id: 4,
    name: "Bob Johnson",
    email: "bob@example.com",
  },
];

export function CreateCalendarModal({
  visible,
  onClose,
  onCreate,
}: CreateCalendarModalProps) {
  const { theme } = useTheme();
  const [calendarName, setCalendarName] = useState("");
  const [friendSearch, setFriendSearch] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [invitedPeople, setInvitedPeople] = useState<InvitedPerson[]>([]);
  const [showFriendSuggestions, setShowFriendSuggestions] = useState(false);
  const friendSearchInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const isSelectingSuggestionRef = useRef(false);

  // Filter friends based on search query
  const filteredFriends = useMemo(() => {
    if (!friendSearch.trim()) return [];
    const query = friendSearch.toLowerCase();
    return MOCK_FRIENDS.filter(
      (friend) =>
        friend.name.toLowerCase().includes(query) ||
        friend.email.toLowerCase().includes(query)
    ).filter(
      (friend) =>
        !invitedPeople.some((invited) => invited.email === friend.email)
    );
  }, [friendSearch, invitedPeople]);

  const handleCreate = () => {
    if (calendarName.trim()) {
      onCreate(calendarName.trim());
      setCalendarName("");
      setFriendSearch("");
      setEmailInput("");
      setInvitedPeople([]);
      onClose();
    }
  };

  const handleClose = () => {
    setCalendarName("");
    setFriendSearch("");
    setEmailInput("");
    setInvitedPeople([]);
    onClose();
  };

  const handleAddFriend = (friend: Friend) => {
    isSelectingSuggestionRef.current = true;
    const newInvite: InvitedPerson = {
      id: `friend-${friend.id}`,
      name: friend.name,
      email: friend.email,
      type: "friend",
      avatarUrl: friend.avatarUrl,
    };
    setInvitedPeople((prev) => [...prev, newInvite]);
    setFriendSearch("");
    setShowFriendSuggestions(false);
    setTimeout(() => {
      isSelectingSuggestionRef.current = false;
    }, 200);
  };

  const handleAddEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (email && isValidEmail(email)) {
      // Check if already invited
      if (!invitedPeople.some((invited) => invited.email === email)) {
        const newInvite: InvitedPerson = {
          id: `email-${Date.now()}`,
          name: email,
          email: email,
          type: "email",
        };
        setInvitedPeople([...invitedPeople, newInvite]);
        setEmailInput("");
        // Refocus the email input to continue adding
        setTimeout(() => {
          emailInputRef.current?.focus();
        }, 100);
      }
    }
  };

  const handleRemoveInvite = (id: string) => {
    setInvitedPeople(invitedPeople.filter((person) => person.id !== id));
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
    },
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
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: 32,
      fontWeight: "600",
      color: theme.colors.foreground,
      marginBottom: theme.spacing.sm,
      letterSpacing: -0.5,
    },
    description: {
      fontSize: 16,
      color: theme.colors.mutedForeground,
      marginBottom: theme.spacing.xl,
    },
    input: {
      height: 48,
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.lg,
      fontSize: 16,
      backgroundColor: theme.colors.input,
      color: theme.colors.foreground,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    section: {
      marginTop: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.foreground,
      marginBottom: theme.spacing.md,
    },
    searchContainer: {
      position: "relative",
      marginBottom: theme.spacing.md,
    },
    suggestionsContainer: {
      position: "absolute",
      top: 52,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      maxHeight: 200,
      zIndex: 1000,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    suggestionItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    suggestionItemLast: {
      borderBottomWidth: 0,
    },
    suggestionAvatar: {
      marginRight: theme.spacing.md,
    },
    suggestionInfo: {
      flex: 1,
    },
    suggestionName: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.foreground,
      marginBottom: 2,
    },
    suggestionEmail: {
      fontSize: 14,
      color: theme.colors.mutedForeground,
    },
    emailInputContainer: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    emailInput: {
      flex: 1,
      height: 48,
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.lg,
      fontSize: 16,
      backgroundColor: theme.colors.input,
      color: theme.colors.foreground,
      borderColor: theme.colors.border,
    },
    addEmailButton: {
      height: 48,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    invitedContainer: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    invitedCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    invitedLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      flex: 1,
      marginRight: theme.spacing.md,
    },
    invitedName: {
      fontSize: 15,
      fontWeight: "500",
      color: theme.colors.foreground,
    },
    removeButton: {
      padding: 4,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Button variant="ghost" size="icon" onPress={handleClose}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.foreground}
              />
            </Button>
          </View>
          <View style={styles.headerRight}>
            <Button
              variant="ghost"
              size="icon"
              onPress={handleCreate}
              disabled={!calendarName.trim()}
            >
              <Ionicons
                name="checkmark"
                size={24}
                color={
                  calendarName.trim()
                    ? theme.colors.primary
                    : theme.colors.mutedForeground
                }
              />
            </Button>
          </View>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Create New Calendar</Text>
          <Text style={styles.description}>
            Enter a name for your new calendar to get started.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Calendar name"
            placeholderTextColor={theme.colors.mutedForeground}
            value={calendarName}
            onChangeText={setCalendarName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreate}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Invite People</Text>

            {invitedPeople.length > 0 && (
              <View style={styles.invitedContainer}>
                {invitedPeople.map((person) => (
                  <View key={person.id} style={styles.invitedCard}>
                    <View style={styles.invitedLeft}>
                      <Avatar size="sm">
                        {person.avatarUrl && (
                          <AvatarImage
                            source={
                              typeof person.avatarUrl === "number"
                                ? person.avatarUrl
                                : { uri: person.avatarUrl }
                            }
                            alt={person.name}
                          />
                        )}
                        <AvatarFallback>
                          {getInitials(person.name)}
                        </AvatarFallback>
                      </Avatar>
                      <Text style={styles.invitedName}>{person.name}</Text>
                    </View>
                    <Pressable
                      onPress={() => handleRemoveInvite(person.id)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash" size={18} color="#ef4444" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.searchContainer}>
              <TextInput
                ref={friendSearchInputRef}
                style={styles.input}
                placeholder="Search friends by name or email"
                placeholderTextColor={theme.colors.mutedForeground}
                value={friendSearch}
                onChangeText={(text) => {
                  setFriendSearch(text);
                  setShowFriendSuggestions(text.length > 0);
                }}
                onFocus={() =>
                  setShowFriendSuggestions(
                    friendSearch.length > 0 && filteredFriends.length > 0
                  )
                }
                onBlur={() => {
                  setTimeout(() => {
                    if (!isSelectingSuggestionRef.current) {
                      setShowFriendSuggestions(false);
                    }
                  }, 200);
                }}
              />
              {showFriendSuggestions && filteredFriends.length > 0 && (
                <View
                  style={styles.suggestionsContainer}
                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                  onTouchStart={() => {
                    isSelectingSuggestionRef.current = true;
                  }}
                >
                  {filteredFriends.map((friend, index) => (
                    <Pressable
                      key={friend.id}
                      style={[
                        styles.suggestionItem,
                        index === filteredFriends.length - 1 &&
                          styles.suggestionItemLast,
                      ]}
                      onPress={() => handleAddFriend(friend)}
                    >
                      <View style={styles.suggestionAvatar}>
                        <Avatar size="sm">
                          {friend.avatarUrl && (
                            <AvatarImage
                              source={
                                typeof friend.avatarUrl === "number"
                                  ? friend.avatarUrl
                                  : { uri: friend.avatarUrl }
                              }
                              alt={friend.name}
                            />
                          )}
                          <AvatarFallback>
                            {getInitials(friend.name)}
                          </AvatarFallback>
                        </Avatar>
                      </View>
                      <View style={styles.suggestionInfo}>
                        <Text style={styles.suggestionName}>{friend.name}</Text>
                        <Text style={styles.suggestionEmail}>
                          {friend.email}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.emailInputContainer}>
              <TextInput
                ref={emailInputRef}
                style={styles.emailInput}
                placeholder="Or enter email address"
                placeholderTextColor={theme.colors.mutedForeground}
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleAddEmail}
              />
              <Pressable
                style={[
                  styles.addEmailButton,
                  !isValidEmail(emailInput.trim()) && {
                    opacity: 0.5,
                  },
                ]}
                onPress={handleAddEmail}
                disabled={!isValidEmail(emailInput.trim())}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={theme.colors.primaryForeground}
                />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
