import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const recommendedGroups = [
  { id: 1, name: "Jaipur Travelers" },
  { id: 2, name: "Udaipur Backpackers" },
  { id: 3, name: "Jaisalmer Desert Trip" },
];

const chats = [
  { id: 1, name: "Aman Sharma", lastMessage: "See you tomorrow!" },
  { id: 2, name: "Pushkar Trip Group", lastMessage: "Tickets booked!" },
];

export default function Chat() {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.search}
        placeholder="Search chats or groups..."
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recommended Groups */}
        <Text style={styles.sectionTitle}>Recommended Groups</Text>

        {recommendedGroups.map((group) => (
          <TouchableOpacity key={group.id} style={styles.groupCard}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.joinText}>Join</Text>
          </TouchableOpacity>
        ))}

        {/* Chats */}
        <Text style={styles.sectionTitle}>Chats</Text>

        {chats.map((chat) => (
          <TouchableOpacity key={chat.id} style={styles.chatCard}>
            <Text style={styles.chatName}>{chat.name}</Text>
            <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Create Group Button */}
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createText}>+ Create Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  groupCard: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupName: {
    fontSize: 14,
    fontWeight: "500",
  },
  joinText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  chatCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  chatName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  lastMessage: {
    color: "#777",
    marginTop: 2,
  },
  createButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  createText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
