import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Map360() {
  const { name } = useLocalSearchParams();

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <Text>360° View for {name}</Text>
    </View>
  );
}