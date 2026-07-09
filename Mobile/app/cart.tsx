import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react-native";
import { useCartStore } from "../src/store/cartStore";

const DELIVERY_FEE = 1.99;

export default function CartScreen() {
  const { bottom } = useSafeAreaInsets();
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const promoDiscount = useCartStore((s) => s.promoDiscount);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotal = useCartStore((s) => s.getTotal);

  const subtotal = getSubtotal();
  const total = getTotal();
  const discount = subtotal * promoDiscount;
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const ok = applyPromo(promoInput.trim());
    setPromoMsg({
      text: ok
        ? `Code "${promoInput.toUpperCase()}" applied — ${(promoDiscount * 100).toFixed(0)}% off!`
        : "That code isn't valid. Try FOOD50 or SAVE20.",
      ok,
    });
  };

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
        <Header count={0} />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            paddingHorizontal: 40,
          }}
        >
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: "#fff7ed",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
            }}
          >
            <ShoppingBag size={44} color="#f97316" />
          </View>
          <Text
            style={{ fontSize: 20, fontWeight: "800", color: "#171717", textAlign: "center" }}
          >
            Your cart is empty
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#a3a3a3",
              textAlign: "center",
              lineHeight: 21,
            }}
          >
            Looks like you haven't added anything yet. Browse our menu and pick something delicious!
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              backgroundColor: "#f97316",
              paddingHorizontal: 32,
              paddingVertical: 15,
              borderRadius: 16,
              marginTop: 8,
              opacity: pressed ? 0.9 : 1,
              shadowColor: "#f97316",
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 5,
            })}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
              Browse Food
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <Header count={totalCount} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180, paddingTop: 4 }}
      >
        {/* ── Cart items ── */}
        <View style={{ paddingHorizontal: 20, gap: 12, marginBottom: 20 }}>
          {items.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: 92, height: 92 }}
                contentFit="cover"
              />
              <View style={{ flex: 1, padding: 13, justifyContent: "space-between" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#171717",
                      flex: 1,
                      marginRight: 8,
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Pressable
                    onPress={() => removeItem(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </Pressable>
                </View>
                <Text style={{ fontSize: 12, color: "#a3a3a3" }}>{item.restaurantName}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ fontSize: 15, fontWeight: "800", color: "#f97316" }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                    <Pressable
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 1.5,
                        borderColor: "#e5e5e5",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Minus size={13} color="#171717" />
                    </Pressable>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: "#171717",
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </Text>
                    <Pressable
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: "#f97316",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Plus size={13} color="#fff" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Promo Code ── */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginBottom: 12,
            }}
          >
            <Tag size={16} color="#f97316" />
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#171717" }}>
              Promo Code
            </Text>
          </View>

          {promoCode ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f0fdf4",
                borderRadius: 12,
                padding: 13,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#16a34a" }}>
                {promoCode} applied
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#16a34a" }}>
                -{(promoDiscount * 100).toFixed(0)}% off
              </Text>
            </View>
          ) : (
            <>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TextInput
                  value={promoInput}
                  onChangeText={(t) => {
                    setPromoInput(t);
                    setPromoMsg(null);
                  }}
                  placeholder="e.g. FOOD50 or SAVE20"
                  placeholderTextColor="#b0b0b0"
                  autoCapitalize="characters"
                  style={{
                    flex: 1,
                    backgroundColor: "#f8f8f8",
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 11,
                    fontSize: 14,
                    color: "#171717",
                  }}
                />
                <Pressable
                  onPress={handleApplyPromo}
                  style={({ pressed }) => ({
                    backgroundColor: "#f97316",
                    paddingHorizontal: 18,
                    borderRadius: 12,
                    justifyContent: "center",
                    opacity: pressed ? 0.88 : 1,
                  })}
                >
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                    Apply
                  </Text>
                </Pressable>
              </View>
              {promoMsg && (
                <Text
                  style={{
                    fontSize: 12,
                    color: promoMsg.ok ? "#16a34a" : "#ef4444",
                    marginTop: 8,
                    lineHeight: 18,
                  }}
                >
                  {promoMsg.text}
                </Text>
              )}
            </>
          )}
        </View>

        {/* ── Order Summary ── */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#171717",
              marginBottom: 16,
              letterSpacing: -0.2,
            }}
          >
            Order Summary
          </Text>

          <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <SummaryRow label="Delivery Fee" value={`$${DELIVERY_FEE.toFixed(2)}`} />
          {discount > 0 && (
            <SummaryRow
              label="Discount"
              value={`-$${discount.toFixed(2)}`}
              green
            />
          )}

          <View
            style={{ height: 1, backgroundColor: "#f0f0f0", marginVertical: 14 }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "700", color: "#171717" }}
            >
              Total
            </Text>
            <Text
              style={{ fontSize: 22, fontWeight: "800", color: "#f97316" }}
            >
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Checkout CTA ── */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#f8f8f8",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: bottom + 20,
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
        }}
      >
        <Pressable
          onPress={() => router.push("/(customer)/checkout")}
          style={({ pressed }) => ({
            backgroundColor: "#f97316",
            borderRadius: 20,
            paddingVertical: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            opacity: pressed ? 0.9 : 1,
            shadowColor: "#f97316",
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 7,
          })}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
              {totalCount} {totalCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
            Checkout
          </Text>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
            ${total.toFixed(2)}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Header({ count }: { count: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
      }}
    >
      <Pressable
        onPress={() => router.back()}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <ArrowLeft size={20} color="#171717" />
      </Pressable>

      <Text style={{ fontSize: 20, fontWeight: "800", color: "#171717", letterSpacing: -0.3 }}>
        My Cart
      </Text>

      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: count > 0 ? "#f97316" : "#f0f0f0",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: count > 0 ? "#fff" : "#a3a3a3", fontWeight: "700", fontSize: 15 }}>
          {count}
        </Text>
      </View>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <Text style={{ fontSize: 14, color: green ? "#16a34a" : "#737373" }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: green ? "#16a34a" : "#171717",
        }}
      >
        {value}
      </Text>
    </View>
  );
}
