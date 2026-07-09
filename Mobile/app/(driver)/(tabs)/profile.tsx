import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, color: "#737373" }}>Profile</Text>
      </View>
    </SafeAreaView>
  );
}
