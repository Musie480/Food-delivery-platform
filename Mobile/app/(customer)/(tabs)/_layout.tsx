import { useState, useRef, useEffect } from "react";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { View, Platform, StyleSheet, Pressable, Text, Animated } from "react-native";
import {
  ClipboardList,
  Compass,
  Heart,
  Home,
  User,
} from "lucide-react-native";

const ORANGE = "#f97316";

// Tab Button Component with scale spring tactile feedback
function TabButton({
  isFocused,
  label,
  routeName,
  onPress,
  onLongPress,
}: {
  isFocused: boolean;
  label: string;
  routeName: string;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  // Icon selector based on routeName
  const renderIcon = (color: string, size: number) => {
    switch (routeName) {
      case "index":
        return <Home size={size} color={color} />;
      case "explore":
        return <Compass size={size} color={color} />;
      case "orders":
        return <ClipboardList size={size} color={color} />;
      case "favorites":
        return <Heart size={size} color={color} />;
      case "profile":
        return <User size={size} color={color} />;
      default:
        return <Home size={size} color={color} />;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.tabButton,
          isFocused ? styles.tabButtonActive : styles.tabButtonInactive,
        ]}
      >
        {renderIcon(isFocused ? ORANGE : "#64748b", isFocused ? 15 : 18)}
        {isFocused && (
          <Text style={styles.tabLabel} numberOfLines={1}>
            {label === "index" ? "Home" : label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <BlurView intensity={90} tint="light" style={styles.blurBackground}>
        <View style={styles.tabBarInner}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            const label = options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

            return (
              <TabButton
                key={route.key}
                isFocused={isFocused}
                label={label}
                routeName={route.name}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

export default function CustomerTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="favorites" options={{ title: "Favorites" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 28 : 16,
    left: 16,
    right: 16,
    borderRadius: 30,
    backgroundColor: "transparent",
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  blurBackground: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  tabBarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
    height: 64,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: "#ffedd5", // Orange-100
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tabButtonInactive: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabLabel: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: "700",
    color: ORANGE,
  },
});
