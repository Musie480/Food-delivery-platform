import { useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import {
  Bell,
  ChevronDown,
  Clock,
  MapPin,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react-native";
import { useCartStore } from "../../../src/store/cartStore";
import { BANNERS, CATEGORIES, FOOD_ITEMS, RESTAURANTS } from "../../../src/data/mockData";

const { width: W } = Dimensions.get("window");
const BANNER_W = W - 40;

export default function HomeScreen() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const cartCount = useCartStore((s) => s.getCount());

  const filtered =
    activeCategory === "all"
      ? FOOD_ITEMS
      : FOOD_ITEMS.filter((f) => f.category === activeCategory);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* ── Header ── */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 20,
          }}
        >
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: "#fff7ed",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapPin size={17} color="#f97316" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 11,
                  color: "#a3a3a3",
                  fontWeight: "500",
                }}
              >
                Deliver to
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Text
                  style={{ fontSize: 15, fontWeight: "700", color: "#171717" }}
                >
                  Baker Street, London
                </Text>
                <ChevronDown size={14} color="#737373" />
              </View>
            </View>
          </Pressable>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => router.push("/cart")}
              style={({ pressed }) => ({
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <ShoppingCart size={19} color="#171717" />
              {cartCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 17,
                    height: 17,
                    borderRadius: 8.5,
                    backgroundColor: "#f97316",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "#fff",
                  }}
                >
                  <Text style={{ fontSize: 9, fontWeight: "800", color: "#fff" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => ({
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Bell size={19} color="#171717" />
            </Pressable>
          </View>
        </View>

        {/* ── Search bar ── */}
        <Pressable
          onPress={() => router.push("/(customer)/(tabs)/explore")}
          style={({ pressed }) => ({
            marginHorizontal: 20,
            marginBottom: 22,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 14,
            paddingHorizontal: 16,
            height: 50,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 1,
            borderWidth: 1,
            borderColor: "#f2f2f2",
            opacity: pressed ? 0.95 : 1,
          })}
        >
          <Search size={18} color="#a3a3a3" />
          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 14,
              color: "#b0b0b0",
            }}
          >
            Search for food, cuisine...
          </Text>
        </Pressable>

        {/* ── Banner Carousel ── */}
        <View style={{ marginBottom: 26 }}>
          <ScrollView
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={BANNER_W + 16}
            snapToAlignment="start"
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
            onScroll={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (BANNER_W + 16));
              setActiveBanner(Math.max(0, Math.min(idx, BANNERS.length - 1)));
            }}
            scrollEventThrottle={16}
          >
             {BANNERS.map((banner) => (
              <View
                key={banner.id}
                style={{
                  width: BANNER_W,
                  height: 136,
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: banner.image }}
                  style={{ position: "absolute", width: "100%", height: "100%" }}
                  contentFit="cover"
                />

                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.35)",
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 18,
                    paddingVertical: 16,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>
                      {banner.badge}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 20,
                          fontWeight: "800",
                          lineHeight: 24,
                          letterSpacing: -0.3,
                        }}
                      >
                        {banner.title}
                      </Text>
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        {banner.subtitle}
                      </Text>
                    </View>

                    <Pressable
                      style={({ pressed }) => ({
                        backgroundColor: "#f97316",
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: 9999,
                        opacity: pressed ? 0.85 : 1,
                      })}
                    >
                      <Text
                        style={{ color: "#fff", fontWeight: "800", fontSize: 11 }}
                      >
                        {banner.cta} →
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Dot indicator */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
              marginTop: 12,
            }}
          >
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === activeBanner ? 22 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === activeBanner ? "#f97316" : "#e0e0e0",
                }}
              />
            ))}
          </View>
        </View>

        {/* ── Categories ── */}
        <View style={{ marginBottom: 26 }}>
          <SectionHeader title="Categories" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: active ? "#f97316" : "#fff",
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    gap: 6,
                    shadowColor: "#000",
                    shadowOpacity: active ? 0.08 : 0.04,
                    shadowRadius: 8,
                    elevation: active ? 3 : 1,
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: active ? "700" : "600",
                      color: active ? "#fff" : "#525252",
                    }}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Popular Restaurants ── */}
        <View style={{ marginBottom: 31 }}>
          <SectionHeader title="Popular Restaurants" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
          >
            {RESTAURANTS.map((r) => (
              <Pressable
                key={r.id}
                style={({ pressed }) => ({
                  width: 230,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 2,
                  opacity: pressed ? 0.95 : 1,
                })}
              >
                <View>
                  <Image
                    source={{ uri: r.image }}
                    style={{ width: "100%", height: 140 }}
                    contentFit="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "#f97316",
                      borderRadius: 8,
                      paddingHorizontal: 7,
                      paddingVertical: 3,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Star size={10} color="#fff" fill="#fff" />
                    <Text style={{ fontSize: 11, fontWeight: "800", color: "#fff" }}>
                      {r.rating}
                    </Text>
                  </View>
                  {r.isOpen && (
                    <View
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        borderRadius: 6,
                        paddingHorizontal: 7,
                        paddingVertical: 3,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#22c55e",
                        }}
                      />
                      <Text style={{ fontSize: 10, fontWeight: "700", color: "#fff" }}>
                        Open
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ padding: 14, gap: 4 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{ fontSize: 16, fontWeight: "700", color: "#171717", flex: 1 }}
                      numberOfLines={1}
                    >
                      {r.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: "#a3a3a3" }}>
                      {r.distance}
                    </Text>
                  </View>
                  <Text
                    style={{ fontSize: 12, color: "#a3a3a3" }}
                    numberOfLines={1}
                  >
                    {r.cuisine}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      marginTop: 4,
                      paddingTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: "#f5f5f5",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                    >
                      <Clock size={12} color="#a3a3a3" />
                      <Text style={{ fontSize: 12, color: "#737373" }}>
                        {r.deliveryTime} min
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: "#d4d4d4" }}>|</Text>
                    <Text style={{ fontSize: 12, color: "#737373" }}>
                      ${r.deliveryFee.toFixed(2)} fee
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── Today's Deals ── */}
        <View>
          <SectionHeader title="Today's Deals" />
          <View style={{ paddingHorizontal: 20, gap: 14 }}>
            {filtered.slice(0, 6).map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/food/${item.id}`)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowRadius: 10,
                  elevation: 2,
                  opacity: pressed ? 0.96 : 1,
                })}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 100, height: 100 }}
                  contentFit="cover"
                />
                <View
                  style={{
                    flex: 1,
                    padding: 13,
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                      {item.isBestseller && (
                        <View
                          style={{
                            backgroundColor: "#fff7ed",
                            paddingHorizontal: 7,
                            paddingVertical: 3,
                            borderRadius: 7,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "700",
                              color: "#f97316",
                            }}
                          >
                            Best
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={{ fontSize: 12, color: "#a3a3a3", marginTop: 3 }}
                      numberOfLines={1}
                    >
                      {item.restaurantName}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Star size={12} color="#f97316" fill="#f97316" />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: "#171717",
                        }}
                      >
                        {item.rating}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#a3a3a3" }}>
                        ({item.reviews})
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: "#f97316",
                      }}
                    >
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 14,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "800", color: "#171717", letterSpacing: -0.3 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 13, color: "#f97316", fontWeight: "600" }}>See all</Text>
    </View>
  );
}
