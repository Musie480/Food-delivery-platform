import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Building2,
  Crosshair,
  Home,
  MapPin,
  Search,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "sonner-native";
import * as Location from "expo-location";
import MapLibreMap, {
  type MapLibreMapRef,
} from "../../src/components/MapLibreMap";
import { addressesApi } from "../../src/api/addresses";
import { font } from "../../src/theme";

const ORANGE = "#f97316";
const ORANGE_LIGHT = "#fff7ed";
const { width: SCREEN_W } = Dimensions.get("window");
const MAP_H = SCREEN_W * 0.55;

const TITLES = [
  { key: "Home", icon: <Home size={18} color="#fff" /> },
  { key: "Work", icon: <Building2 size={18} color="#fff" /> },
  { key: "Other", icon: <MapPin size={18} color="#fff" /> },
] as const;

interface SearchResult {
  label: string;
  address: string;
  lat: number;
  lng: number;
  locality: string;
  region: string;
  country: string;
}

export default function AddressFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEdit = !!id;

  const mapRef = useRef<MapLibreMapRef>(null);
  const scrollRef = useRef<ScrollView>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [title, setTitle] = useState("Other");
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [currentCenter, setCurrentCenter] = useState<[number, number]>([
    38.7578, 8.9806,
  ]);
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [locating, setLocating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  /* ── Load existing address ── */
  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const { addresses: list } = await addressesApi.list();
        const found = list.find((a) => a.id === id);
        if (found) {
          setTitle(found.title);
          setLabel(found.label ?? "");
          setAddress(found.address);
          setIsDefault(found.isDefault);
          if (found.lat != null && found.lng != null) {
            setCurrentCenter([found.lng, found.lat]);
          }
        }
      } catch {
        toast.error("Failed to load address");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  /* ── Get current location ── */
  const handleLocate = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        toast.error("Location permission denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const lngLat: [number, number] = [loc.coords.longitude, loc.coords.latitude];
      setCurrentCenter(lngLat);
      mapRef.current?.flyTo(lngLat, 15);
      reverseGeocode(loc.coords.latitude, loc.coords.longitude);
    } catch {
      toast.error("Failed to get location");
    } finally {
      setLocating(false);
    }
  };

  /* ── Reverse geocode ── */
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const { result } = await addressesApi.reverseGeocode(lat, lng);
      if (result) {
        setAddress(result.address);
      }
    } catch {
      /* silent */
    }
  }, []);

  /* ── Handle map center change (drag) ── */
  const handleCenterChange = useCallback(
    (center: [number, number]) => {
      setCurrentCenter(center);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        reverseGeocode(center[1], center[0]);
      }, 600);
    },
    [reverseGeocode],
  );

  /* ── Place search (debounced) ── */
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { results } = await addressesApi.searchPlaces(text);
        setSearchResults(results);
        setShowResults(true);
      } catch {
        /* silent */
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const selectResult = (r: SearchResult) => {
    const lngLat: [number, number] = [r.lng, r.lat];
    setCurrentCenter(lngLat);
    mapRef.current?.flyTo(lngLat, 15);
    setAddress(r.address);
    setSearchQuery(r.label);
    setSearchResults([]);
    setShowResults(false);
    Keyboard.dismiss();
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!address.trim()) {
      toast.error("Please enter an address");
      return;
    }
    setSaving(true);
    try {
      const data = {
        title,
        label: label.trim() || undefined,
        address: address.trim(),
        lat: currentCenter[1],
        lng: currentCenter[0],
        isDefault,
      };
      if (isEdit) {
        await addressesApi.update(id!, data);
        toast.success("Address updated");
      } else {
        await addressesApi.create(data);
        toast.success("Address added");
      }
      router.back();
    } catch {
      toast.error(`Failed to ${isEdit ? "update" : "add"} address`);
    } finally {
      setSaving(false);
    }
  };

  /* ── Animations ── */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
        <SafeAreaView
          edges={["top"]}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={ORANGE} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#fff" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 14,
            gap: 12,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: "#f5f5f5",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <ArrowLeft size={20} color="#171717" />
          </Pressable>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#171717",
              letterSpacing: -0.3,
            }}
          >
            {isEdit ? "Edit Address" : "New Address"}
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* ── Map section ── */}
          <View style={{ height: MAP_H }}>
            <MapLibreMap
              ref={mapRef}
              center={currentCenter}
              zoom={15}
              marker={{ id: "selected-pin", lngLat: currentCenter }}
              interactive
              onCenterChange={handleCenterChange}
            />

            {/* Map overlay header */}
            <View
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                right: 12,
                flexDirection: "row",
                gap: 8,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  gap: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 4,
                }}
              >
                <Search size={18} color="#a3a3a3" />
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontFamily: font.body,
                    color: "#171717",
                  }}
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholder="Search place..."
                  placeholderTextColor="#a3a3a3"
                />
                {searching && <ActivityIndicator size="small" color={ORANGE} />}
              </View>

              <Pressable
                onPress={handleLocate}
                disabled={locating}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 4,
                }}
              >
                {locating ? (
                  <ActivityIndicator size="small" color={ORANGE} />
                ) : (
                  <Crosshair size={20} color="#171717" />
                )}
              </Pressable>
            </View>

            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 64,
                  left: 12,
                  right: 72,
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  shadowColor: "#000",
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 6,
                  maxHeight: 200,
                  overflow: "hidden",
                }}
              >
                <ScrollView keyboardShouldPersistTaps="handled">
                  {searchResults.map((r, i) => (
                    <Pressable
                      key={i}
                      onPress={() => selectResult(r)}
                      style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        opacity: pressed ? 0.7 : 1,
                        borderBottomWidth:
                          i < searchResults.length - 1 ? 1 : 0,
                        borderBottomColor: "#f0f0f0",
                      })}
                    >
                      <MapPin size={16} color="#a3a3a3" />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#171717",
                          }}
                          numberOfLines={1}
                        >
                          {r.label}
                        </Text>
                        <Text
                          style={{ fontSize: 12, color: "#a3a3a3" }}
                          numberOfLines={1}
                        >
                          {[r.locality, r.region, r.country]
                            .filter(Boolean)
                            .join(", ")}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Pin hint */}
            <View
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                right: 12,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  Drag map to set location
                </Text>
              </View>
            </View>
          </View>

          {/* ── Form fields ── */}
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 120,
              gap: 20,
            }}
          >
            {/* Title pills */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#525252",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                Label
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {TITLES.map((t) => {
                  const active = title === t.key;
                  return (
                    <Pressable
                      key={t.key}
                      onPress={() => setTitle(t.key)}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        paddingVertical: 13,
                        borderRadius: 14,
                        backgroundColor: active ? ORANGE : "#fff",
                        borderWidth: 1,
                        borderColor: active ? ORANGE : "#e5e5e5",
                      }}
                    >
                      {active && t.icon}
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: active ? "#fff" : "#525252",
                        }}
                      >
                        {t.key}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Custom label */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#525252",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                Custom label (optional)
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#e5e5e5",
                  backgroundColor: "#fff",
                  paddingHorizontal: 14,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    fontSize: 16,
                    fontFamily: font.body,
                    color: "#171717",
                  }}
                  value={label}
                  onChangeText={setLabel}
                  placeholder={`e.g. "Mom's house"`}
                  placeholderTextColor="#a3a3a3"
                />
              </View>
            </View>

            {/* Address */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#525252",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                Full address
              </Text>
              <View
                style={{
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#e5e5e5",
                  backgroundColor: "#fff",
                  paddingHorizontal: 14,
                }}
              >
                <TextInput
                  style={{
                    paddingVertical: 14,
                    fontSize: 16,
                    fontFamily: font.body,
                    color: "#171717",
                    minHeight: 48,
                  }}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter full address"
                  placeholderTextColor="#a3a3a3"
                  multiline
                />
              </View>
            </View>

            {/* Set as default */}
            <Pressable
              onPress={() => setIsDefault(!isDefault)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: isDefault ? ORANGE_LIGHT : "#fff",
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: isDefault ? ORANGE : "#e5e5e5",
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: isDefault ? ORANGE : "#d4d4d4",
                  backgroundColor: isDefault ? ORANGE : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isDefault && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#fff",
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#171717",
                  }}
                >
                  Set as default address
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#a3a3a3",
                    marginTop: 1,
                  }}
                >
                  This will be your primary delivery address
                </Text>
              </View>
            </Pressable>
          </ScrollView>

          {/* ── Sticky Save button ── */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 34,
              backgroundColor: "#f8f8f8",
              borderTopWidth: 1,
              borderTopColor: "#f0f0f0",
            }}
          >
            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={{
                backgroundColor: ORANGE,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                opacity: saving ? 0.5 : 1,
                shadowColor: ORANGE,
                shadowOpacity: 0.3,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#fff",
                  }}
                >
                  {isEdit ? "Update Address" : "Save Address"}
                </Text>
              )}
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
