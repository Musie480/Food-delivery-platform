import { useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react-native";
import { useCartStore } from "../../src/store/cartStore";
import { FOOD_ITEMS } from "../../src/data/mockData";

const { height: H } = Dimensions.get("window");
const IMAGE_H = H * 0.4;

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();
  const addItem = useCartStore((s) => s.addItem);

  const item = FOOD_ITEMS.find((f) => f.id === id);

  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState<Record<string, string>>({});
  const [selectedCheckbox, setSelectedCheckbox] = useState<Record<string, string[]>>({});
  const [added, setAdded] = useState(false);

  if (!item) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f8f8f8" }}>
        <Text style={{ color: "#737373" }}>Item not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: "#f97316", fontWeight: "600" }}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const addonsTotal = () => {
    let extra = 0;
    item.customizeGroups?.forEach((group) => {
      if (group.type === "checkbox") {
        const sel = selectedCheckbox[group.name] ?? [];
        group.options.forEach((opt) => {
          if (sel.includes(opt.id) && opt.price) extra += opt.price;
        });
      }
    });
    return extra;
  };

  const unitPrice = item.price + addonsTotal();
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    addItem({
      foodId: item.id,
      name: item.name,
      price: unitPrice,
      image: item.image,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
    });
    setAdded(true);
    setTimeout(() => router.back(), 700);
  };

  const toggleRadio = (group: string, optId: string) =>
    setSelectedRadio((prev) => ({ ...prev, [group]: optId }));

  const toggleCheckbox = (group: string, optId: string) =>
    setSelectedCheckbox((prev) => {
      const cur = prev[group] ?? [];
      const updated = cur.includes(optId)
        ? cur.filter((x) => x !== optId)
        : [...cur, optId];
      return { ...prev, [group]: updated };
    });

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      {/* Hero image */}
      <View style={{ height: IMAGE_H }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
        {/* Top scrim */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            backgroundColor: "rgba(0,0,0,0.18)",
          }}
        />
        {/* Bottom fade */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
            backgroundColor: "rgba(248,248,248,0.0)",
          }}
        />

        {/* Floating buttons */}
        <SafeAreaView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 8,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 4,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <ArrowLeft size={20} color="#171717" />
          </Pressable>

          <Pressable
            onPress={() => setLiked((v) => !v)}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 4,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Heart
              size={20}
              color={liked ? "#ef4444" : "#171717"}
              fill={liked ? "#ef4444" : "transparent"}
            />
          </Pressable>
        </SafeAreaView>
      </View>

      {/* Content panel */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#f8f8f8",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          marginTop: -28,
        }}
      >
        {/* Drag handle */}
        <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 6 }}>
          <View
            style={{
              width: 38,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#e0e0e0",
            }}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        >
          {/* Name + Price */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 8,
              marginTop: 4,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 22,
                fontWeight: "800",
                color: "#171717",
                marginRight: 12,
                letterSpacing: -0.5,
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{ fontSize: 24, fontWeight: "800", color: "#f97316" }}
            >
              ${item.price.toFixed(2)}
            </Text>
          </View>

          {/* Rating row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 14,
            }}
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                color="#f97316"
                fill={s <= Math.floor(item.rating) ? "#f97316" : "transparent"}
              />
            ))}
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#171717" }}>
              {item.rating}
            </Text>
            <Text style={{ fontSize: 13, color: "#a3a3a3" }}>
              ({item.reviews} reviews)
            </Text>
          </View>

          {/* Description */}
          <Text
            style={{
              fontSize: 14,
              color: "#737373",
              lineHeight: 22,
              marginBottom: 24,
            }}
          >
            {item.description}
          </Text>

          {/* Customise groups */}
          {item.customizeGroups?.map((group) => (
            <View key={group.name} style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: "#171717",
                  marginBottom: 12,
                  letterSpacing: -0.2,
                }}
              >
                {group.name}
              </Text>

              {group.type === "radio" ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                  {group.options.map((opt) => {
                    const active =
                      selectedRadio[group.name] === opt.id ||
                      (!selectedRadio[group.name] && group.options[0].id === opt.id);
                    return (
                      <Pressable
                        key={opt.id}
                        onPress={() => toggleRadio(group.name, opt.id)}
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: active ? "#f97316" : "#fff",
                          borderWidth: 1.5,
                          borderColor: active ? "#f97316" : "#e5e5e5",
                          shadowColor: active ? "#f97316" : "#000",
                          shadowOpacity: active ? 0.22 : 0.04,
                          shadowRadius: 6,
                          elevation: active ? 3 : 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: active ? "#fff" : "#404040",
                          }}
                        >
                          {opt.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View style={{ gap: 10 }}>
                  {group.options.map((opt) => {
                    const checked = (selectedCheckbox[group.name] ?? []).includes(opt.id);
                    return (
                      <Pressable
                        key={opt.id}
                        onPress={() => toggleCheckbox(group.name, opt.id)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#fff",
                          borderRadius: 14,
                          padding: 14,
                          borderWidth: 1.5,
                          borderColor: checked ? "#f97316" : "#f0f0f0",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <View
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 6,
                              borderWidth: 2,
                              borderColor: checked ? "#f97316" : "#d4d4d4",
                              backgroundColor: checked ? "#f97316" : "transparent",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {checked && (
                              <Text
                                style={{
                                  color: "#fff",
                                  fontSize: 12,
                                  fontWeight: "800",
                                }}
                              >
                                ✓
                              </Text>
                            )}
                          </View>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "500",
                              color: "#404040",
                            }}
                          >
                            {opt.name}
                          </Text>
                        </View>
                        {opt.price != null && (
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "600",
                              color: "#f97316",
                            }}
                          >
                            +${opt.price.toFixed(2)}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          ))}

          {/* Quantity */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 16,
            }}
          >
            <Text
              style={{ fontSize: 15, fontWeight: "700", color: "#171717" }}
            >
              Quantity
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 18 }}
            >
              <Pressable
                onPress={() => setQty(Math.max(1, qty - 1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  borderWidth: 1.5,
                  borderColor: "#e5e5e5",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Minus size={15} color="#171717" />
              </Pressable>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#171717",
                  minWidth: 24,
                  textAlign: "center",
                }}
              >
                {qty}
              </Text>
              <Pressable
                onPress={() => setQty(qty + 1)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#f97316",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={15} color="#fff" />
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Add to Cart CTA */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#f8f8f8",
            paddingHorizontal: 24,
            paddingTop: 14,
            paddingBottom: bottom + 16,
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
          }}
        >
          <Pressable
            onPress={handleAdd}
            style={({ pressed }) => ({
              backgroundColor: added ? "#22c55e" : "#f97316",
              borderRadius: 20,
              paddingVertical: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              opacity: pressed ? 0.9 : 1,
              shadowColor: added ? "#22c55e" : "#f97316",
              shadowOpacity: 0.35,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 7,
            })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <ShoppingCart size={20} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                {added ? "Added to cart!" : "Add to Cart"}
              </Text>
            </View>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
              ${totalPrice.toFixed(2)}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
