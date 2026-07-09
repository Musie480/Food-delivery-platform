import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Search, Star, X, MapPin } from "lucide-react-native";
import { CATEGORIES, FOOD_ITEMS, RESTAURANTS } from "../../../src/data/mockData";

const ORANGE = "#f97316";

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const insets = useSafeAreaInsets();

  const filteredFoods = FOOD_ITEMS.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.restaurantName.toLowerCase().includes(query.toLowerCase());
    const matchesCat = activeFilter === "all" || item.category === activeFilter;
    return matchesQuery && matchesCat;
  });

  const filteredRestaurants = RESTAURANTS.filter(
    (r) =>
      query.length === 0 ||
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* ── Orange Header Area ── */}
      <View style={styles.headerBlock}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>Find your next favorite meal</Text>
        </SafeAreaView>
      </View>

      {/* ── Overlapping Search Bar ── */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for restaurants, dishes..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={12} style={styles.clearBtn}>
              <X size={14} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Filter Tabs ── */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = activeFilter === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setActiveFilter(cat.id)}
                style={({ pressed }) => [
                  styles.filterTab,
                  active ? styles.filterTabActive : styles.filterTabInactive,
                  pressed && styles.pressedState,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    active ? styles.filterTabTextActive : styles.filterTabTextInactive,
                  ]}
                >
                  {cat.emoji} {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.mainScroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* ── Restaurant Results ── */}
        {filteredRestaurants.length > 0 && query.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurants</Text>
            <View style={styles.restaurantList}>
              {filteredRestaurants.map((r) => (
                <Pressable
                  key={r.id}
                  style={({ pressed }) => [
                    styles.restaurantCard,
                    pressed && styles.pressedState,
                  ]}
                >
                  <Image
                    source={{ uri: r.image }}
                    style={styles.restaurantImg}
                    contentFit="cover"
                  />
                  <View style={styles.restaurantInfo}>
                    <View style={styles.restaurantRow}>
                      <Text style={styles.restaurantName} numberOfLines={1}>
                        {r.name}
                      </Text>
                      <View style={styles.ratingBadge}>
                        <Star size={10} color={ORANGE} fill={ORANGE} />
                        <Text style={styles.ratingText}>{r.rating}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.cuisineText} numberOfLines={1}>
                      {r.cuisine}
                    </Text>
                    
                    <View style={styles.metaRow}>
                      <View style={styles.metaBadge}>
                        <MapPin size={10} color="#64748b" />
                        <Text style={styles.metaText}>{r.distance}</Text>
                      </View>
                      <View style={styles.metaBadge}>
                        <Text style={styles.metaText}>{r.deliveryTime} min</Text>
                      </View>
                      <View style={styles.metaBadge}>
                        <Text style={styles.metaText}>${r.deliveryFee.toFixed(2)} fee</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ── Food Items Grid ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {query.length > 0 ? "Results" : "Popular Items"}
          </Text>

          {filteredFoods.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Search size={32} color={ORANGE} />
              </View>
              <Text style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptyDesc}>
                We couldn't find anything matching "{query}". Try a different search!
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredFoods.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/food/${item.id}`)}
                  style={({ pressed }) => [
                    styles.foodCard,
                    pressed && styles.pressedState,
                  ]}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.foodImg}
                    contentFit="cover"
                  />
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.foodRestaurant} numberOfLines={1}>
                      {item.restaurantName}
                    </Text>
                    
                    <View style={styles.foodFooter}>
                      <Text style={styles.foodPrice}>
                        ${item.price.toFixed(2)}
                      </Text>
                      <View style={styles.foodRatingRow}>
                        <Star size={10} color={ORANGE} fill={ORANGE} />
                        <Text style={styles.foodRatingText}>{item.rating}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 45, // Reduced padding
    position: "relative",
    overflow: "hidden",
  },
  bgCircle1: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    position: "absolute",
    top: -80,
    right: -40,
  },
  bgCircle2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    position: "absolute",
    bottom: -10,
    left: -30,
  },
  headerSafeArea: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  headerTitle: {
    fontSize: 26, // Reduced from 32
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13, // Reduced from 15
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
    fontWeight: "500",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -25, // Overlap slightly
    marginBottom: 12,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16, // Reduced from 20
    paddingHorizontal: 14, // Reduced
    height: 50, // Reduced from 60
    shadowColor: "#0f172a",
    shadowOpacity: 0.06, // Softened
    shadowRadius: 10, // Softened
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  searchInput: {
    flex: 1,
    fontSize: 14, // Reduced from 16
    color: "#0f172a",
    fontWeight: "500",
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  filterWrapper: {
    marginBottom: 14,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14, // Reduced from 20
    paddingVertical: 8, // Reduced from 12
    borderRadius: 12, // Reduced from 16
    borderWidth: 1,
  },
  filterTabActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
    shadowColor: ORANGE,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  filterTabInactive: {
    backgroundColor: "#fff",
    borderColor: "#e2e8f0",
  },
  filterTabText: {
    fontSize: 13, // Reduced from 14
  },
  filterTabTextActive: {
    fontWeight: "700",
    color: "#fff",
  },
  filterTabTextInactive: {
    fontWeight: "600",
    color: "#64748b",
  },
  mainScroll: {
    paddingHorizontal: 20,
    gap: 24, // Reduced gap
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16, // Reduced from 18
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  restaurantList: {
    gap: 12,
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16, // Reduced from 24
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f8fafc",
    padding: 10, // Reduced from 12
    gap: 12,
  },
  restaurantImg: {
    width: 76, // Reduced from 90
    height: 76,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: "center",
  },
  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 15, // Reduced from 16
    fontWeight: "800",
    color: "#0f172a",
    flex: 1,
    marginRight: 6,
    letterSpacing: -0.2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "700",
    color: ORANGE,
  },
  cuisineText: {
    fontSize: 12, // Reduced from 13
    color: "#64748b",
    marginBottom: 8,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // Reduced from 8
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  metaText: {
    fontSize: 10, // Reduced from 11
    fontWeight: "600",
    color: "#64748b",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12, // Reduced from 16
  },
  foodCard: {
    width: "48%", // Better spacing
    backgroundColor: "#fff",
    borderRadius: 16, // Reduced from 24
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f8fafc",
  },
  foodImg: {
    width: "100%",
    height: 110, // Reduced from 140
    backgroundColor: "#f1f5f9",
  },
  foodInfo: {
    padding: 12, // Reduced from 14
  },
  foodName: {
    fontSize: 14, // Reduced from 15
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  foodRestaurant: {
    fontSize: 11, // Reduced from 12
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 10,
  },
  foodFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  foodPrice: {
    fontSize: 15, // Reduced from 16
    fontWeight: "800",
    color: ORANGE,
  },
  foodRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  foodRatingText: {
    fontSize: 10,
    fontWeight: "700",
    color: ORANGE,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 30,
  },
  pressedState: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
