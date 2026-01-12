import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ use this

import { Ionicons } from "@expo/vector-icons";

const recommendedGroups = [
  {
    id: "r1",
    name: "Jaipur Explorers",
    members: "156",
    img: "https://picsum.photos/seed/group1/100",
  },
  {
    id: "r2",
    name: "Thar Desert Adventurers",
    members: "89",
    img: "https://picsum.photos/seed/group2/100",
  },
  {
    id: "r3",
    name: "Pushkar Backpackers",
    members: "102",
    img: "https://picsum.photos/seed/group3/100",
  },
];

const chats = [
  {
    id: "c1",
    name: "Rahul",
    msg: "The view from Amer Fort was amazing!",
    time: "10:45 AM",
    type: "dm",
    pic: "https://picsum.photos/seed/rahul/100",
  },
  {
    id: "c2",
    name: "Udaipur Trip 2024",
    msg: "Priya: Where are we meeting for dinner?",
    time: "Yesterday",
    type: "group",
    pic: "https://picsum.photos/seed/udaipur/100",
  },
  {
    id: "c3",
    name: "Amit Guide",
    msg: "I will be available at 9 AM tomorrow.",
    time: "Monday",
    type: "dm",
    pic: "https://picsum.photos/seed/amit/100",
  },
];

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header + Search */}
      <View style={styles.header}>
        <Text style={styles.title}>MESSAGES</Text>
        <TouchableOpacity style={styles.plusBtn}>
          <Ionicons name="add-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search chats or groups..."
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recommended Groups */}
        <View style={styles.recommendationSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Join Travel Groups</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {recommendedGroups.map((group) => (
              <View key={group.id} style={styles.groupCard}>
                <Image
                  source={{ uri: group.img }}
                  style={styles.groupImage}
                />
                <Text style={styles.groupName} numberOfLines={1}>
                  {group.name}
                </Text>
                <Text style={styles.groupMembers}>{group.members} active travelers</Text>
                <TouchableOpacity style={styles.joinBtn}>
                  <Ionicons name="person-add-outline" size={12} color="#fff" />
                  <Text style={styles.joinBtnText}>JOIN NOW</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Create Group */}
        <TouchableOpacity style={styles.createGroup}>
          <View style={styles.createIcon}>
            <Ionicons name="people-outline" size={20} color="#888" />
          </View>
          <View>
            <Text style={styles.createTitle}>Create New Group</Text>
            <Text style={styles.createSubtitle}>
              Coordinate with fellow explorers
            </Text>
          </View>
        </TouchableOpacity>

        {/* Chat List */}
        <View style={styles.chatList}>
          {chats.map((chat) => (
            <TouchableOpacity key={chat.id} style={styles.chatCard}>
              <View style={styles.chatImageWrapper}>
                <Image source={{ uri: chat.pic }} style={styles.chatImage} />
                {chat.type === "group" && (
                  <View style={styles.groupIcon}>
                    <Ionicons name="people-outline" size={10} color="#fff" />
                  </View>
                )}
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatTopRow}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </View>
                <Text style={styles.chatMsg} numberOfLines={1}>
                  {chat.msg}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 20, fontWeight: "900", fontStyle: "italic" },
  plusBtn: {
    backgroundColor: "#fbbf24",
    padding: 8,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40 },
  recommendationSection: { marginVertical: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sectionLabel: { fontSize: 10, fontWeight: "900", color: "#888", letterSpacing: 1 },
  seeAll: { fontSize: 10, fontWeight: "700", color: "#fbbf24" },
  horizontalScroll: { paddingLeft: 16 },
  groupCard: {
    minWidth: 160,
    backgroundColor: "#fef3c7",
    borderRadius: 20,
    marginRight: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  groupImage: { width: 48, height: 48, borderRadius: 12, marginBottom: 6 },
  groupName: { fontSize: 12, fontWeight: "700", marginBottom: 2, textAlign: "center" },
  groupMembers: { fontSize: 10, color: "#555", marginBottom: 6, textAlign: "center" },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fbbf24",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  joinBtnText: { fontSize: 10, fontWeight: "700", color: "#fff", marginLeft: 2 },
  createGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    margin: 16,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    gap: 12,
  },
  createIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  createTitle: { fontSize: 14, fontWeight: "bold", color: "#111" },
  createSubtitle: { fontSize: 10, color: "#555" },
  chatList: { paddingHorizontal: 16, paddingBottom: 24 },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    gap: 12,
  },
  chatImageWrapper: { position: "relative" },
  chatImage: { width: 50, height: 50, borderRadius: 12 },
  groupIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#fbbf24",
    borderRadius: 6,
    padding: 2,
  },
  chatContent: { flex: 1, minWidth: 0 },
  chatTopRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  chatName: { fontSize: 14, fontWeight: "700", color: "#111" },
  chatTime: { fontSize: 10, color: "#888" },
  chatMsg: { fontSize: 12, color: "#555" },
});
