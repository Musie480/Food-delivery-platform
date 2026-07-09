import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, color: "#737373" }}>Map</Text>
      </View>
    </SafeAreaView>
  );
}
