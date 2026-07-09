import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type ViewToken,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Truck, UtensilsCrossed, ShieldCheck, ArrowRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    Icon: Truck,
    title: "Fast Delivery",
    subtitle:
      "Your favourite food arrives at your door in minutes. Hot, fresh, and on time.",
    accent: "#f97316",
    bg: "#fff7ed",
  },
  {
    id: "2",
    Icon: UtensilsCrossed,
    title: "100+ Restaurants",
    subtitle:
      "Explore a wide variety of cuisines from the best local restaurants near you.",
    accent: "#f97316",
    bg: "#fff7ed",
  },
  {
    id: "3",
    Icon: ShieldCheck,
    title: "Easy & Secure",
    subtitle:
      "Order with confidence. Simple checkout, trusted payments, and full order tracking.",
    accent: "#f97316",
    bg: "#fff7ed",
  },
] as const;

async function completeOnboarding() {
  await SecureStore.setItemAsync("onboarding_done", "true");
  router.replace("/(customer)/(auth)/login");
}

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      {/* Skip button */}
      <View style={{ alignItems: "flex-end", paddingHorizontal: 24, paddingTop: 8 }}>
        {!isLast && (
          <Pressable
            onPress={completeOnboarding}
            hitSlop={12}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={{ fontSize: 14, color: "#a3a3a3", fontWeight: "500" }}>
              Skip
            </Text>
          </Pressable>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 32,
              paddingBottom: 40,
            }}
          >
            {/* Icon illustration */}
            <View
              style={{
                width: 160,
                height: 160,
                borderRadius: 48,
                backgroundColor: item.bg,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 48,
                shadowColor: item.accent,
                shadowOpacity: 0.15,
                shadowRadius: 32,
                shadowOffset: { width: 0, height: 12 },
                elevation: 6,
              }}
            >
              <item.Icon size={72} color={item.accent} strokeWidth={1.5} />
            </View>

            {/* Text */}
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#171717",
                textAlign: "center",
                marginBottom: 16,
                letterSpacing: -0.5,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#737373",
                textAlign: "center",
                lineHeight: 26,
                maxWidth: 300,
              }}
            >
              {item.subtitle}
            </Text>
          </View>
        )}
        style={{ flex: 1 }}
      />

      {/* Bottom bar */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 32,
          gap: 24,
          alignItems: "center",
        }}
      >
        {/* Dot indicators */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                height: 8,
                width: i === activeIndex ? 24 : 8,
                borderRadius: 4,
                backgroundColor: i === activeIndex ? "#f97316" : "#e5e5e5",
              }}
            />
          ))}
        </View>

        {/* Next / Get Started button */}
        <Pressable
          onPress={goNext}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: "#f97316",
            borderRadius: 9999,
            paddingVertical: 16,
            paddingHorizontal: 40,
            width: "100%",
            opacity: pressed ? 0.85 : 1,
            shadowColor: "#f97316",
            shadowOpacity: 0.35,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 },
            elevation: 4,
          })}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#fff",
              letterSpacing: 0.2,
            }}
          >
            {isLast ? "Get Started" : "Next"}
          </Text>
          <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
