import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ChevronRight, ClipboardList, MapPin, Receipt, RotateCcw } from "lucide-react-native";

type OrderStatus = "delivered" | "preparing" | "on_the_way" | "confirmed";

interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: string[];
  total: number;
  date: string;
  status: OrderStatus;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-1256",
    restaurantName: "Burger Palace",
    restaurantImage:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80",
    items: ["Cheese Burger", "Coca Cola", "French Fries"],
    total: 14.97,
    date: "Today, 12:45 PM",
    status: "on_the_way",
  },
  {
    id: "ORD-1201",
    restaurantName: "Pizza Heaven",
    restaurantImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
    items: ["Pepperoni Pizza", "Garlic Bread"],
    total: 18.48,
    date: "Yesterday, 7:30 PM",
    status: "delivered",
  },
  {
    id: "ORD-1143",
    restaurantName: "Sushi Garden",
    restaurantImage:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80",
    items: ["Salmon Maki Roll", "Miso Soup"],
    total: 15.98,
    date: "Mon, 8:15 PM",
    status: "delivered",
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: "Confirmed", color: "#2563eb", bg: "#eff6ff" },
  preparing: { label: "Preparing", color: "#d97706", bg: "#fffbeb" },
  on_the_way: { label: "On the Way", color: "#f97316", bg: "#fff7ed" },
  delivered: { label: "Delivered", color: "#16a34a", bg: "#f0fdf4" },
};

const ORANGE = "#f97316";

export default function OrdersScreen() {
  const [tab, setTab] = useState<"active" | "past">("active");
  const insets = useSafeAreaInsets();

  const active = MOCK_ORDERS.filter((o) => o.status !== "delivered");
  const past = MOCK_ORDERS.filter((o) => o.status === "delivered");
  const shown = tab === "active" ? active : past;

  return (
    <View style={styles.container}>
      {/* Header Block with Segmented Control */}
      <View style={styles.headerBlock}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>My Orders</Text>
            <View style={styles.headerBadge}>
              <Receipt size={14} color={ORANGE} />
            </View>
          </View>

          {/* Segmented Tab Control */}
          <View style={styles.tabContainer}>
            {(["active", "past"] as const).map((t) => {
              const isActive = tab === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTab(t)}
                  style={[
                    styles.tabItem,
                    isActive && styles.tabItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.tabTextActive,
                    ]}
                  >
                    {t === "active" ? "Active" : "Past Orders"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content */}
      {shown.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <ClipboardList size={44} color={ORANGE} />
          </View>
          <Text style={styles.emptyTitle}>
            No {tab === "active" ? "active" : "past"} orders
          </Text>
          <Text style={styles.emptyDesc}>
            {tab === "active"
              ? "Place an order and track it here in real time."
              : "Your order history will appear here once delivered."}
          </Text>
          {tab === "active" && (
            <Pressable
              onPress={() => router.push("/(customer)/(tabs)/explore")}
              style={({ pressed }) => [
                styles.emptyBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.emptyBtnText}>Explore Restaurants</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {shown.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            return (
              <Pressable
                key={order.id}
                style={({ pressed }) => [
                  styles.orderCard,
                  pressed && styles.cardPressed,
                ]}
              >
                {/* Header row of card: Image, Name, Status */}
                <View style={styles.cardHeaderRow}>
                  <Image
                    source={{ uri: order.restaurantImage }}
                    style={styles.cardImg}
                    contentFit="cover"
                  />
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                      {order.restaurantName}
                    </Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: cfg.color }]}>
                      {cfg.label}
                    </Text>
                  </View>
                </View>

                {/* Items & details */}
                <View style={styles.cardBody}>
                  <Text style={styles.itemsList} numberOfLines={2}>
                    {order.items.join(" · ")}
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.totalPrice}>
                      ${order.total.toFixed(2)}
                    </Text>

                    <View style={styles.actionsRow}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.actionBtnOutline,
                          pressed && styles.btnPressed,
                        ]}
                      >
                        <RotateCcw size={14} color={ORANGE} style={{ marginRight: 6 }} />
                        <Text style={styles.actionBtnOutlineText}>Reorder</Text>
                      </Pressable>

                      {order.status === "on_the_way" && (
                        <Pressable
                          style={({ pressed }) => [
                            styles.actionBtnSolid,
                            pressed && styles.btnPressed,
                          ]}
                        >
                          <Text style={styles.actionBtnSolidText}>Track</Text>
                          <MapPin size={13} color="#fff" style={{ marginLeft: 4 }} />
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerBlock: {
    backgroundColor: ORANGE,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  bgCircle1: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    position: "absolute",
    top: -60,
    right: -40,
  },
  bgCircle2: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    position: "absolute",
    bottom: -20,
    left: -40,
  },
  headerSafeArea: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  headerBadge: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  tabItemActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
  },
  tabTextActive: {
    color: ORANGE,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 9999,
    marginTop: 24,
    shadowColor: ORANGE,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  emptyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // Account for bottom tab bar
    gap: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
    overflow: "hidden",
  },
  cardPressed: {
    backgroundColor: "#f8fafc",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
  },
  cardHeaderInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  orderDate: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 16,
  },
  itemsList: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffedd5",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  actionBtnOutlineText: {
    fontSize: 13,
    fontWeight: "700",
    color: ORANGE,
  },
  actionBtnSolid: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  actionBtnSolidText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
});
