import { ActivityIndicator, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fafafa",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color="#f97316" size="large" />
    </View>
  );
}
