import "../global.css";

import { useEffect, useRef, useState } from "react";
import { Stack, SplashScreen, useRootNavigationState, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { Toaster } from "sonner-native";
import { useFonts } from "@expo-google-fonts/inter";
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { useAuthStore } from "../src/store/authStore";
import { Image, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [storageReady, setStorageReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const navigationState = useRootNavigationState();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const redirectedRef = useRef(false);

  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
    SpaceGrotesk: SpaceGrotesk_400Regular,
    SpaceGroteskMedium: SpaceGrotesk_500Medium,
    SpaceGroteskSemiBold: SpaceGrotesk_600SemiBold,
    SpaceGroteskBold: SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    SecureStore.getItemAsync("onboarding_done")
      .then((val) => {
        setHasSeenOnboarding(val === "true");
      })
      .catch(() => {})
      .finally(() => {
        setStorageReady(true);
        SplashScreen.hideAsync();
      });
  }, []);

  useEffect(() => {
    if (!storageReady || !navigationState?.key || redirectedRef.current) return;
    redirectedRef.current = true;

    if (!hasSeenOnboarding) {
      router.replace("/onboarding");
    } else if (!isAuthenticated || !user) {
      router.replace("/(customer)/(auth)/login");
    } else if (user.role === "driver") {
      router.replace("/(driver)/(tabs)");
    } else {
      router.replace("/(customer)/(tabs)");
    }
  }, [storageReady, navigationState?.key]);

  if (!navigationState?.key || !storageReady || !fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fafafa",
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              <Image
                source={require("../assets/del.png")}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
          <Toaster position="top-center" richColors theme="light" duration={4000} />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
