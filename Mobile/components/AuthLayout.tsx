import type { ReactNode } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { font } from "../src/theme";

const ORANGE = "#f97316";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* ── Orange Background Header ── */}
      <View style={styles.headerBlock}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/del.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Overlapping Card */}
          <View style={styles.cardContainer}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>{title}</Text>
              {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
            </View>
            <View style={styles.childrenWrapper}>{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: ORANGE,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: "hidden",
  },
  bgCircle1: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    position: "absolute",
    top: -50,
    right: -70,
  },
  bgCircle2: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    position: "absolute",
    bottom: 20,
    left: -40,
  },
  headerSafeArea: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginTop: 16,
  },
  logo: {
    width: 52,
    height: 52,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 150, // Ensures card overlaps the header beautifully
    paddingBottom: 30,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  titleWrapper: {
    alignItems: "center",
    marginBottom: 26,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: font.heading,
    color: "#0f172a",
    textAlign: "center",
    letterSpacing: -0.4,
  },
  subtitleText: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },
  childrenWrapper: {
    gap: 16,
  },
});
