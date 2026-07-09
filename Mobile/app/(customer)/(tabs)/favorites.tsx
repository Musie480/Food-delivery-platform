import { useState, useRef, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import {
  Heart,
  Star,
  Plus,
  Clock,
  Store,
  RotateCcw,
  X,
  ChevronRight,
  ShoppingBag,
  Utensils,
  MapPin,
  Sparkles,
  ArrowLeft,
} from "lucide-react-native";
import { FOOD_ITEMS, RESTAURANTS } from "../../../src/data/mockData";
import { useCartStore } from "../../../src/store/cartStore";

const INITIAL_FAVORITES = ["f1", "f3", "f5"];
const INITIAL_FAV_RESTAURANTS = ["r1", "r3"];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);
  const [favRestaurants, setFavRestaurants] = useState<string[]>(INITIAL_FAV_RESTAURANTS);
  const [activeTab, setActiveTab] = useState<"dishes" | "restaurants">("dishes");
  
  // Cart state for header badge
  const cartCount = useCartStore((s) => s.getCount());

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"add_to_cart" | "remove_dish" | "remove_restaurant" | "info">("info");
  const [lastActionData, setLastActionData] = useState<any>(null);
  const toastAnim = useRef(new Animated.Value(120)).current;
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (
    message: string,
    type: "add_to_cart" | "remove_dish" | "remove_restaurant" | "info",
    data?: any
  ) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    setToastType(type);
    setLastActionData(data);
    setToastVisible(true);

    Animated.spring(toastAnim, {
      toValue: 0,
      tension: 100,
      friction: 9,
      useNativeDriver: true,
    }).start();

    toastTimeoutRef.current = setTimeout(() => {
      hideToast();
    }, 4500);
  };

  const hideToast = () => {
    Animated.timing(toastAnim, {
      toValue: 120,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setToastVisible(false);
    });
  };

  const handleUndo = () => {
    if (!lastActionData) return;
    if (toastType === "remove_dish") {
      setFavorites((prev) => [...prev, lastActionData]);
      hideToast();
    } else if (toastType === "remove_restaurant") {
      setFavRestaurants((prev) => [...prev, lastActionData]);
      hideToast();
    }
  };

  const toggleFav = (id: string) => {
    if (favorites.includes(id)) {
      const item = FOOD_ITEMS.find((f) => f.id === id);
      setFavorites((prev) => prev.filter((x) => x !== id));
      showToast(`Removed "${item?.name || "item"}" from favorites`, "remove_dish", id);
    } else {
      setFavorites((prev) => [...prev, id]);
    }
  };

  const toggleFavRestaurant = (id: string) => {
    if (favRestaurants.includes(id)) {
      const res = RESTAURANTS.find((r) => r.id === id);
      setFavRestaurants((prev) => prev.filter((x) => x !== id));
      showToast(`Removed "${res?.name || "restaurant"}" from favorites`, "remove_restaurant", id);
    } else {
      setFavRestaurants((prev) => [...prev, id]);
    }
  };

  const handleAddToCart = (item: typeof FOOD_ITEMS[0]) => {
    const cartStore = useCartStore.getState();
    cartStore.addItem({
      foodId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
    });
    showToast(`Added "${item.name}" to cart`, "add_to_cart");
  };

  const favoriteItems = FOOD_ITEMS.filter((f) => favorites.includes(f.id));
  const favoriteRestaurants = RESTAURANTS.filter((r) => favRestaurants.includes(r.id));

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {/* Premium Header Block with Colored Background & Wave circles */}
      <View style={styles.headerBlock}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.headerTopRow}>
            {/* Back Button on the Left */}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.headerBackBtn,
                pressed && styles.headerBtnPressed,
              ]}
            >
              <ArrowLeft size={18} color="#fff" />
            </Pressable>

            {/* Center Container for Title & Sparkles */}
            <View style={styles.headerTitleContainer}>
              <Sparkles size={20} color="#fde047" style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Favorites</Text>
            </View>

            {/* Quick Action Button - Cart Shortcut */}
            <Pressable
              onPress={() => router.push("/cart")}
              style={({ pressed }) => [
                styles.headerCartBtn,
                pressed && styles.headerBtnPressed,
              ]}
            >
              <ShoppingBag size={18} color="#fff" />
              {cartCount > 0 && (
                <View style={styles.headerCartBadge}>
                  <Text style={styles.headerCartBadgeText}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          <Text style={styles.headerSubtitle}>
            {favoriteItems.length} {favoriteItems.length === 1 ? "dish" : "dishes"} ·{" "}
            {favoriteRestaurants.length} {favoriteRestaurants.length === 1 ? "restaurant" : "restaurants"} saved
          </Text>
        </SafeAreaView>
      </View>

      {/* Segmented Control */}
      <View style={[styles.tabContainer, { marginTop: 20 }]}>
        <Pressable
          onPress={() => setActiveTab("dishes")}
          style={[styles.tabButton, activeTab === "dishes" && styles.activeTabButton]}
        >
          <Utensils
            size={16}
            color={activeTab === "dishes" ? "#f97316" : "#64748b"}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, activeTab === "dishes" && styles.activeTabText]}>
            Dishes
          </Text>
          {favoriteItems.length > 0 && (
            <View style={[styles.countBadge, activeTab === "dishes" && styles.activeCountBadge]}>
              <Text style={[styles.countText, activeTab === "dishes" && styles.activeCountText]}>
                {favoriteItems.length}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("restaurants")}
          style={[styles.tabButton, activeTab === "restaurants" && styles.activeTabButton]}
        >
          <Store
            size={16}
            color={activeTab === "restaurants" ? "#f97316" : "#64748b"}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, activeTab === "restaurants" && styles.activeTabText]}>
            Restaurants
          </Text>
          {favoriteRestaurants.length > 0 && (
            <View style={[styles.countBadge, activeTab === "restaurants" && styles.activeCountBadge]}>
              <Text style={[styles.countText, activeTab === "restaurants" && styles.activeCountText]}>
                {favoriteRestaurants.length}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Main Content */}
      {activeTab === "dishes" ? (
        favoriteItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Heart size={44} color="#f43f5e" fill="#f43f5e" />
            </View>
            <Text style={styles.emptyTitle}>No saved dishes</Text>
            <Text style={styles.emptyDescription}>
              Save your favorite dishes here to quickly order them anytime.
            </Text>
            <Pressable
              onPress={() => router.push("/(customer)/(tabs)/explore")}
              style={styles.exploreButton}
            >
              <Text style={styles.exploreButtonText}>Browse Dishes</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {favoriteItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/food/${item.id}`)}
                style={({ pressed }) => [styles.dishCard, pressed && styles.cardPressed]}
              >
                <View style={styles.dishImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.dishImage} contentFit="cover" />
                  {item.isBestseller && (
                    <View style={styles.bestsellerBadge}>
                      <Text style={styles.bestsellerText}>BESTSELLER</Text>
                    </View>
                  )}
                  <View style={styles.ratingBadge}>
                    <Star size={10} color="#fbbf24" fill="#fbbf24" style={{ marginRight: 2 }} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>

                <View style={styles.dishDetails}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dishName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.restaurantRow}>
                      <Store size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                      <Text style={styles.dishRestaurant} numberOfLines={1}>
                        {item.restaurantName}
                      </Text>
                    </View>
                    <Text style={styles.dishDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>

                  <View style={styles.dishBottomRow}>
                    <Text style={styles.dishPrice}>${item.price.toFixed(2)}</Text>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      style={({ pressed }) => [
                        styles.addButton,
                        pressed && styles.addButtonPressed,
                      ]}
                    >
                      <Plus size={13} color="#f97316" style={{ marginRight: 3 }} />
                      <Text style={styles.addButtonText}>Add</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Favorite Heart Toggle */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFav(item.id);
                  }}
                  style={styles.heartButton}
                >
                  <Heart size={15} color="#f43f5e" fill="#f43f5e" />
                </Pressable>
              </Pressable>
            ))}
          </ScrollView>
        )
      ) : favoriteRestaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Store size={44} color="#f97316" />
          </View>
          <Text style={styles.emptyTitle}>No saved restaurants</Text>
          <Text style={styles.emptyDescription}>
            Keep track of your go-to eateries by adding them to your favorites.
          </Text>
          <Pressable
            onPress={() => router.push("/(customer)/(tabs)/explore")}
            style={styles.exploreButton}
          >
            <Text style={styles.exploreButtonText}>Browse Restaurants</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {favoriteRestaurants.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => {
                showToast(`Viewing menu for ${r.name}`, "info");
                router.push("/(customer)/(tabs)/explore");
              }}
              style={({ pressed }) => [styles.resCard, pressed && styles.cardPressed]}
            >
              <View style={styles.resImageContainer}>
                <Image source={{ uri: r.image }} style={styles.resImage} contentFit="cover" />
                <View style={styles.resDistanceBadge}>
                  <MapPin size={11} color="#0f172a" style={{ marginRight: 3 }} />
                  <Text style={styles.resDistanceText}>{r.distance}</Text>
                </View>
                {r.isOpen && (
                  <View style={styles.resStatusBadge}>
                    <Text style={styles.resStatusText}>OPEN</Text>
                  </View>
                )}
                {/* Favorite Heart Toggle */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavRestaurant(r.id);
                  }}
                  style={styles.resHeartButton}
                >
                  <Heart size={16} color="#f43f5e" fill="#f43f5e" />
                </Pressable>
              </View>

              <View style={styles.resDetails}>
                <View style={styles.resHeaderRow}>
                  <Text style={styles.resName} numberOfLines={1}>
                    {r.name}
                  </Text>
                  <View style={styles.resRatingContainer}>
                    <Star size={13} color="#fbbf24" fill="#fbbf24" style={{ marginRight: 3 }} />
                    <Text style={styles.resRatingText}>{r.rating.toFixed(1)}</Text>
                    <Text style={styles.resReviewsText}>({r.reviews})</Text>
                  </View>
                </View>

                <Text style={styles.resCuisine}>{r.cuisine}</Text>

                <View style={styles.resDivider} />

                <View style={styles.resInfoRow}>
                  <View style={styles.resInfoItem}>
                    <Clock size={13} color="#64748b" style={{ marginRight: 4 }} />
                    <Text style={styles.resInfoText}>{r.deliveryTime} mins</Text>
                  </View>
                  <View style={styles.resInfoDot} />
                  <View style={styles.resInfoItem}>
                    <Text style={styles.resInfoText}>
                      {r.deliveryFee === 0 ? "Free delivery" : `$${r.deliveryFee.toFixed(2)} delivery`}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Animated Toast Notification */}
      {toastVisible && (
        <Animated.View
          style={[styles.toastContainer, { transform: [{ translateY: toastAnim }] }]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginRight: 8 }}>
            <View style={styles.toastIconBg}>
              {toastType === "add_to_cart" ? (
                <ShoppingBag size={15} color="#22c55e" />
              ) : toastType === "info" ? (
                <Store size={15} color="#f97316" />
              ) : (
                <RotateCcw size={15} color="#94a3b8" />
              )}
            </View>
            <Text style={styles.toastText} numberOfLines={2}>
              {toastMessage}
            </Text>
          </View>

          {toastType === "add_to_cart" ? (
            <Pressable
              onPress={() => {
                hideToast();
                router.push("/cart");
              }}
              style={styles.toastActionBtn}
            >
              <Text style={styles.toastActionText}>View Cart</Text>
              <ChevronRight size={14} color="#f97316" />
            </Pressable>
          ) : (toastType === "remove_dish" || toastType === "remove_restaurant") ? (
            <Pressable onPress={handleUndo} style={styles.toastActionBtn}>
              <Text style={styles.toastActionText}>Undo</Text>
            </Pressable>
          ) : (
            <Pressable onPress={hideToast} style={styles.toastCloseBtn}>
              <X size={14} color="#94a3b8" />
            </Pressable>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    backgroundColor: "#f97316",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingBottom: 24,
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
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.6,
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
  headerCartBtn: {
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
  headerCartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f97316",
    paddingHorizontal: 3,
  },
  headerCartBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "800",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 6,
    fontWeight: "500",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 16,
  },
  activeTabButton: {
    backgroundColor: "#fff",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabText: {
    color: "#f97316",
    fontWeight: "700",
  },
  countBadge: {
    backgroundColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  activeCountBadge: {
    backgroundColor: "#ffedd5",
  },
  countText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
  },
  activeCountText: {
    color: "#f97316",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  dishCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardPressed: {
    opacity: 0.98,
    transform: [{ scale: 0.99 }],
  },
  dishImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  dishImage: {
    width: "100%",
    height: "100%",
  },
  bestsellerBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#fbbf24",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 1,
  },
  bestsellerText: {
    color: "#0f172a",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  ratingBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 1,
  },
  ratingText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  dishDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  dishName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    paddingRight: 24, // Leave room for heart button
  },
  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  dishRestaurant: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  dishDescription: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 4,
    lineHeight: 14,
  },
  dishBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f97316",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffedd5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addButtonPressed: {
    backgroundColor: "#fed7aa",
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#f97316",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  resCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  resImageContainer: {
    height: 140,
    position: "relative",
  },
  resImage: {
    width: "100%",
    height: "100%",
  },
  resDistanceBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  resDistanceText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f172a",
  },
  resStatusBadge: {
    position: "absolute",
    top: 12,
    right: 52,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  resStatusText: {
    color: "#166534",
    fontSize: 9,
    fontWeight: "800",
  },
  resHeartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  resDetails: {
    padding: 16,
  },
  resHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  resRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resRatingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  resReviewsText: {
    fontSize: 11,
    color: "#64748b",
    marginLeft: 2,
  },
  resCuisine: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  resDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  resInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  resInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  resInfoText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  resInfoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fff1f2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#f43f5e",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#f97316",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  exploreButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  toastContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 104 : 92,
    left: 16,
    right: 16,
    backgroundColor: "#1e293b",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#0f172a",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    zIndex: 1000,
  },
  toastIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  toastText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  toastActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(249, 115, 22, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  toastActionText: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "700",
  },
  toastCloseBtn: {
    padding: 4,
  },
});
