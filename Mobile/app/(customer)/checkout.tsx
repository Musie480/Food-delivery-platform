import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { ArrowLeft, CheckCircle2, ChevronRight, CreditCard, MapPin, Receipt, Truck } from "lucide-react-native";
import { toast } from "sonner-native";
import { font } from "../../src/theme";
import { addressesApi, type Address } from "../../src/api/addresses";
import { useCartStore } from "../../src/store/cartStore";

const ORANGE = "#f97316";

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  
  // Cart state
  const total = useCartStore((s) => s.getTotal());
  const count = useCartStore((s) => s.getCount());
  const clearCart = useCartStore((s) => s.clearCart);

  // Checkout state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddrs, setLoadingAddrs] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<"card" | "cash">("cash");
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      const { addresses: data } = await addressesApi.list();
      setAddresses(data);
    } catch {
      /* silent */
    } finally {
      setLoadingAddrs(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses])
  );

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const handlePlaceOrder = () => {
    if (!defaultAddress) {
      toast.error("Please add a delivery address first.");
      return;
    }
    setPlacingOrder(true);
    // Simulate network request
    setTimeout(() => {
      clearCart();
      toast.success("Order placed successfully!");
      setPlacingOrder(false);
      router.replace("/(customer)/(tabs)/orders");
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* ── Orange Header ── */}
      <View style={styles.headerBlock}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <ArrowLeft size={20} color="#fff" />
            </Pressable>
            <Text style={styles.headerTitle}>Checkout</Text>
            {/* Spacer */}
            <View style={{ width: 44 }} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Delivery Location ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Location</Text>
          <Pressable
            onPress={() => router.push("/(customer)/addresses")}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
          >
            {loadingAddrs ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color={ORANGE} />
              </View>
            ) : defaultAddress ? (
              <View style={styles.addressRow}>
                <View style={styles.iconBox}>
                  <MapPin size={20} color={ORANGE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressTitle}>{defaultAddress.title}</Text>
                  <Text style={styles.addressText} numberOfLines={2}>
                    {defaultAddress.address}
                  </Text>
                </View>
                <ChevronRight size={18} color="#cbd5e1" />
              </View>
            ) : (
              <View style={styles.addressRow}>
                <View style={[styles.iconBox, { backgroundColor: "#f1f5f9" }]}>
                  <MapPin size={20} color="#64748b" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressTitle}>No Address Selected</Text>
                  <Text style={styles.addressText}>Tap to add a delivery address</Text>
                </View>
                <ChevronRight size={18} color="#cbd5e1" />
              </View>
            )}
          </Pressable>
        </View>

        {/* ── Payment Method ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.card}>
            {/* Cash Option */}
            <Pressable
              onPress={() => setSelectedPayment("cash")}
              style={[styles.paymentRow, { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" }]}
            >
              <View style={[styles.iconBox, { backgroundColor: "#ecfdf5" }]}>
                <Receipt size={18} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentSubtitle}>Pay when your food arrives</Text>
              </View>
              <View style={[styles.radio, selectedPayment === "cash" && styles.radioActive]}>
                {selectedPayment === "cash" && <View style={styles.radioInner} />}
              </View>
            </Pressable>
            
            {/* Card Option */}
            <Pressable
              onPress={() => setSelectedPayment("card")}
              style={styles.paymentRow}
            >
              <View style={[styles.iconBox, { backgroundColor: "#eff6ff" }]}>
                <CreditCard size={18} color="#3b82f6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentTitle}>Credit / Debit Card</Text>
                <Text style={styles.paymentSubtitle}>Visa, Mastercard, Stripe</Text>
              </View>
              <View style={[styles.radio, selectedPayment === "card" && styles.radioActive]}>
                {selectedPayment === "card" && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          </View>
        </View>

        {/* ── Order Summary ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.card}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items</Text>
              <Text style={styles.summaryValue}>{count}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total to Pay</Text>
              <Text style={styles.summaryTotalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Place Order Sticky Footer ── */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable
          onPress={handlePlaceOrder}
          disabled={placingOrder}
          style={({ pressed }) => [
            styles.placeBtn,
            pressed && styles.btnPressed,
            placingOrder && { opacity: 0.7 }
          ]}
        >
          {placingOrder ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.placeBtnText}>Place Order</Text>
              <View style={styles.placeBtnPriceBox}>
                <Text style={styles.placeBtnPrice}>${total.toFixed(2)}</Text>
              </View>
            </>
          )}
        </Pressable>
      </View>
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
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginLeft: 8,
  },
  card: {
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
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    fontWeight: "500",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  paymentSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
    fontWeight: "500",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: ORANGE,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginHorizontal: 20,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  summaryTotalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: ORANGE,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  placeBtn: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18,
    shadowColor: ORANGE,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  placeBtnText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  placeBtnPriceBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  placeBtnPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
});
