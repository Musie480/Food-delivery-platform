import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Home,
  Building2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { toast } from "sonner-native";
import MapLibreMap from "../../src/components/MapLibreMap";
import { addressesApi, type Address } from "../../src/api/addresses";
import { font } from "../../src/theme";

const ORANGE = "#f97316";
const ORANGE_LIGHT = "#fff7ed";
const ORANGE_MUTED = "rgba(249,115,22,0.12)";
const MAP_H = 80;

const TITLE_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Home: { icon: <Home size={16} color={ORANGE} />, color: ORANGE, bg: ORANGE_MUTED },
  Work: {
    icon: <Building2 size={16} color="#3b82f6" />,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
  },
  Other: {
    icon: <MapPin size={16} color="#6b7280" />,
    color: "#6b7280",
    bg: "rgba(107,114,128,0.12)",
  },
};

function AddressCard({
  item,
  index,
  onPress,
  onDelete,
  onSetDefault,
}: {
  item: Address;
  index: number;
  onPress: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const meta = TITLE_META[item.title] ?? TITLE_META.Other;
  const hasCoords = item.lat != null && item.lng != null;

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
      <Pressable
        onPress={onPress}
        onLongPress={onSetDefault}
        style={({ pressed }) => ({
          backgroundColor: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
          opacity: pressed ? 0.92 : 1,
          borderWidth: item.isDefault ? 1.5 : 0,
          borderColor: item.isDefault ? ORANGE : "transparent",
        })}
      >
        {hasCoords && (
          <View style={{ height: MAP_H, overflow: "hidden" }}>
            <MapLibreMap
              center={[item.lng!, item.lat!]}
              zoom={15}
              marker={{ id: "preview", lngLat: [item.lng!, item.lat!] }}
              interactive={false}
            />
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            padding: 16,
            gap: 14,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: meta.bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {meta.icon}
          </View>

          <View style={{ flex: 1, gap: 3 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#171717",
                  fontFamily: font.body,
                  letterSpacing: -0.3,
                }}
              >
                {item.title}
              </Text>
              {item.isDefault && (
                <View
                  style={{
                    backgroundColor: ORANGE,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "800",
                      color: "#fff",
                      letterSpacing: 0.5,
                    }}
                  >
                    DEFAULT
                  </Text>
                </View>
              )}
              {item.label ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#a3a3a3",
                    fontFamily: font.body,
                  }}
                >
                  {item.label}
                </Text>
              ) : null}
            </View>

            <Text
              style={{
                fontSize: 13,
                color: "#525252",
                lineHeight: 18,
                fontFamily: font.body,
              }}
              numberOfLines={2}
            >
              {item.address}
            </Text>
          </View>

          <Pressable
            onPress={onDelete}
            hitSlop={10}
            style={({ pressed }) => ({
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: "#fef2f2",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Trash2 size={15} color="#ef4444" />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    try {
      const { addresses: data } = await addressesApi.list();
      setAddresses(data);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses]),
  );

  const handleDelete = (item: Address) => {
    Alert.alert(
      "Delete Address",
      `Remove "${item.title}" address?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await addressesApi.delete(item.id);
              toast.success("Address deleted");
              fetchAddresses();
            } catch {
              toast.error("Failed to delete address");
            }
          },
        },
      ],
    );
  };

  const handleSetDefault = (item: Address) => {
    if (item.isDefault) return;
    Alert.alert("Set as Default", `Make "${item.title}" your default address?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Set Default",
        onPress: async () => {
          try {
            await addressesApi.setDefault(item.id);
            toast.success("Default address updated");
            fetchAddresses();
          } catch {
            toast.error("Failed to update default address");
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: ORANGE }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 20,
            gap: 12,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <ArrowLeft size={20} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: 0.3,
              }}
            >
              YOUR PLACES
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#fff",
                letterSpacing: -0.3,
              }}
            >
              Saved Addresses
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#fff",
              }}
            >
              {addresses.length}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={ORANGE} />
        </View>
      ) : addresses.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 16 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: ORANGE_LIGHT,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MapPin size={36} color={ORANGE} />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#171717",
              fontFamily: font.body,
            }}
          >
            No saved addresses
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#a3a3a3",
              textAlign: "center",
              lineHeight: 20,
              fontFamily: font.body,
            }}
          >
            Add your home, work, or favorite spots so you can order with one tap
          </Text>
          <Pressable
            onPress={() => router.push("/(customer)/address-form")}
            style={{
              backgroundColor: ORANGE,
              borderRadius: 9999,
              paddingHorizontal: 28,
              paddingVertical: 13,
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#fff",
              }}
            >
              Add Your First Address
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 120,
            gap: 12,
          }}
        >
          {addresses.map((item, i) => (
            <AddressCard
              key={item.id}
              item={item}
              index={i}
              onPress={() => router.push(`/(customer)/address-form?id=${item.id}`)}
              onDelete={() => handleDelete(item)}
              onSetDefault={() => handleSetDefault(item)}
            />
          ))}
        </ScrollView>
      )}

      {addresses.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 40,
            left: 20,
            right: 20,
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => router.push("/(customer)/address-form")}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: ORANGE,
              borderRadius: 9999,
              paddingHorizontal: 28,
              paddingVertical: 15,
              shadowColor: ORANGE,
              shadowOpacity: 0.35,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Plus size={20} color="#fff" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#fff",
              }}
            >
              Add New Address
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
