import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "../../../src/store/authStore";
import { Button } from "../../../components/ui/Button";

export default function DriverDashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleSignOut = () => {
    clearAuth();
    router.replace("/(driver)/(auth)/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "#f97316",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}>K</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: "#a3a3a3" }}>Driver dashboard</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#171717" }}>
              {user?.name ?? "Driver"}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#171717", marginBottom: 8 }}>
            Ready to deliver?
          </Text>
          <Text style={{ fontSize: 14, color: "#737373", lineHeight: 22 }}>
            Accept delivery requests and start earning.
          </Text>
        </View>

        <Button variant="outline" onPress={handleSignOut}>
          Sign out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
