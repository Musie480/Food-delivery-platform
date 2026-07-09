import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import {
  Award,
  ChevronRight,
  CreditCard,
  HelpCircle,
  LogOut,
  MapPin,
  MessageCircle,
  Pencil,
  ReceiptText,
  Shield,
  ShoppingBag,
  Star,
  User,
  Phone,
  Mail,
  Trophy,
  ArrowLeft,
} from "lucide-react-native";
import { router } from "expo-router";
import { useAuthStore } from "../../../src/store/authStore";
import { usersApi } from "../../../src/api/users";

const ORANGE = "#f97316";
const AVATAR = 96;

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL?.replace("/api", "") ??
  "http://localhost:3000";

function avatarUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

interface ProfileRowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  danger?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
}

function ProfileRow({
  icon,
  label,
  subtitle,
  right,
  danger,
  onPress,
  showDivider = true,
}: ProfileRowProps) {
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.rowContainer,
          pressed && styles.rowPressed,
        ]}
      >
        <View
          style={[
            styles.rowIconBg,
            danger ? styles.dangerIconBg : styles.normalIconBg,
          ]}
        >
          {icon}
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.rowLabel,
              danger ? styles.dangerText : styles.normalText,
            ]}
          >
            {label}
          </Text>
          {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
        </View>

        {right ?? (
          <ChevronRight size={16} color={danger ? "#ef4444" : "#94a3b8"} />
        )}
      </Pressable>
      {showDivider && <View style={styles.rowDivider} />}
    </View>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [avatar, setAvatar] = useState<string | undefined>(
    avatarUrl(user?.avatar)
  );

  const fadeY = useRef(new Animated.Value(24)).current;
  const fadeO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeO, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    let alive = true;
    usersApi
      .getProfile()
      .then(({ user: fresh }) => {
        if (!alive) return;
        setAuth(fresh, accessToken!);
        setAvatar(avatarUrl(fresh.avatar));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [accessToken, setAuth]);

  useEffect(() => {
    setAvatar(avatarUrl(user?.avatar));
  }, [user?.avatar]);

  const handleSignOut = () => {
    clearAuth();
    import("sonner-native").then(({ toast }) => toast.success("Signed out successfully"));
    router.replace("/(customer)/(auth)/login");
  };

  const displayName = user?.name ?? "Guest User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {/* Curved Color Header */}
      <View style={styles.headerBlock}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.headerTopRow}>
            {/* Back Button */}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.headerBackBtn,
                pressed && styles.headerBtnPressed,
              ]}
            >
              <ArrowLeft size={18} color="#fff" />
            </Pressable>

            <Text style={styles.headerTitle}>Profile</Text>

            {/* Edit Profile Quick Shortcut */}
            <Pressable
              onPress={() => router.push("/(customer)/edit-profile")}
              style={({ pressed }) => [
                styles.headerEditBtn,
                pressed && styles.headerBtnPressed,
              ]}
            >
              <Pencil size={16} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      {/* Avatar Section overlapping boundary */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarRing}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
        </View>

        {/* Floating Camera / Edit Pencil Icon */}
        <Pressable
          onPress={() => router.push("/(customer)/edit-profile")}
          style={({ pressed }) => [
            styles.avatarEditBadge,
            pressed && styles.avatarEditBadgePressed,
          ]}
        >
          <Pencil size={11} color="#fff" />
        </Pressable>
      </View>

      {/* User Information */}
      <Animated.View
        style={[
          styles.userInfoBlock,
          { opacity: fadeO, transform: [{ translateY: fadeY }] },
        ]}
      >
        <Text style={styles.userName}>{displayName}</Text>
        
        {/* Tier badge / member info */}
        <View style={styles.tierBadge}>
          <Award size={13} color="#f59e0b" fill="#f59e0b" style={{ marginRight: 4 }} />
          <Text style={styles.tierText}>Elite Foodie</Text>
        </View>

        <View style={styles.userContactRow}>
          <Phone size={12} color="#64748b" style={{ marginRight: 4 }} />
          <Text style={styles.userContactText}>{user?.phone ?? "Keleme Delivery"}</Text>
        </View>
      </Animated.View>

      {/* Stats Row */}
      <Animated.View
        style={[
          styles.statsRow,
          { opacity: fadeO, transform: [{ translateY: fadeY }] },
        ]}
      >
        <View style={styles.statCard}>
          <View style={styles.statIconBg}>
            <ShoppingBag size={18} color={ORANGE} />
          </View>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statIconBg}>
            <Star size={18} color={ORANGE} />
          </View>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statIconBg}>
            <Trophy size={18} color={ORANGE} />
          </View>
          <Text style={styles.statValue}>980</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </Animated.View>

      {/* Scrollable menu cards grouped by section */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1, opacity: fadeO, transform: [{ translateY: fadeY }] }}
      >
        <ProfileSection title="ACCOUNT & INFORMATION">
          <ProfileRow
            icon={<User size={16} color={ORANGE} />}
            label="Personal Data"
            subtitle="Manage your name, phone and email"
            onPress={() => router.push("/(customer)/edit-profile")}
          />
          <ProfileRow
            icon={<ReceiptText size={16} color={ORANGE} />}
            label="My Orders"
            subtitle="View history and track active orders"
            onPress={() => router.push("/(customer)/(tabs)/orders")}
          />
          <ProfileRow
            icon={<CreditCard size={16} color={ORANGE} />}
            label="Payment Methods"
            subtitle="Saved cards, wallets and cash options"
          />
          <ProfileRow
            icon={<MapPin size={16} color={ORANGE} />}
            label="Saved Addresses"
            subtitle="Manage delivery locations"
            onPress={() => router.push("/(customer)/addresses")}
            showDivider={false}
          />
        </ProfileSection>

        <ProfileSection title="SUPPORT & DETAILS">
          <ProfileRow
            icon={<MessageCircle size={16} color={ORANGE} />}
            label="Contact Us"
            subtitle="Send feedback or chat with support"
          />
          <ProfileRow
            icon={<HelpCircle size={16} color={ORANGE} />}
            label="Help Center"
            subtitle="FAQ, guides, and customer support"
          />
          <ProfileRow
            icon={<Shield size={16} color={ORANGE} />}
            label="Privacy & Security"
            subtitle="Read our safety policies"
            showDivider={false}
          />
        </ProfileSection>

        <ProfileSection title="SESSION MANAGEMENT">
          <ProfileRow
            icon={<LogOut size={16} color="#ef4444" />}
            label="Sign Out"
            subtitle="Sign out of Keleme account"
            danger
            onPress={handleSignOut}
            right={<ChevronRight size={16} color="#ef4444" />}
            showDivider={false}
          />
        </ProfileSection>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    backgroundColor: "#f97316",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 50,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#f97316",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  bgCircle1: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    position: "absolute",
    top: -40,
    right: -30,
  },
  bgCircle2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    position: "absolute",
    bottom: -20,
    left: -30,
  },
  headerSafeArea: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
  },
  headerEditBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
  },
  headerBtnPressed: {
    opacity: 0.8,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -54,
    zIndex: 10,
    position: "relative",
  },
  avatarRing: {
    width: AVATAR + 8,
    height: AVATAR + 8,
    borderRadius: (AVATAR + 8) / 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarImage: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
  },
  avatarPlaceholder: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: "50%",
    marginRight: -((AVATAR + 8) / 2) + 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ORANGE,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarEditBadgePressed: {
    backgroundColor: "#ea580c",
  },
  userInfoBlock: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7", // Amber-100
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  tierText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#d97706", // Amber-600
  },
  userContactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 30,
  },
  userContactText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  userContactDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 8,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 110,
    gap: 16,
  },
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
    marginLeft: 24,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginHorizontal: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowPressed: {
    backgroundColor: "#f8fafc",
  },
  rowIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  normalIconBg: {
    backgroundColor: "#fff7ed",
  },
  dangerIconBg: {
    backgroundColor: "#fff1f2",
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  normalText: {
    color: "#0f172a",
  },
  dangerText: {
    color: "#ef4444",
  },
  rowSubtitle: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
    fontWeight: "500",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginLeft: 64,
  },
});
