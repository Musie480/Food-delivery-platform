import { useState, useRef } from "react";
import { type TextInputProps, Text, TextInput, View, Animated } from "react-native";
import { font } from "../../src/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    props.onBlur?.(e);
  };

  const borderColor = error ? "#ef4444" : borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e2e8f0", "#f97316"],
  });
  
  const iconBgColor = error ? "#fef2f2" : "#f8fafc";
  const iconColor = error ? "#ef4444" : "#a3a3a3";

  return (
    <View style={{ gap: 6 }}>
      {label && (
        <Text style={{
          fontSize: 11,
          fontFamily: font.body,
          fontWeight: "700",
          color: error ? "#ef4444" : "#64748b",
          letterSpacing: 0.8,
          textTransform: "uppercase",
          marginLeft: 4,
        }}>
          {label}
        </Text>
      )}
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor,
          backgroundColor: "#fff",
          paddingHorizontal: 10,
          paddingVertical: 4,
        }}
      >
        {icon && (
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: iconBgColor,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
            opacity: focused ? 1 : 0.7,
          }}>
            {icon}
          </View>
        )}
        <TextInput
          style={[{
            flex: 1,
            paddingVertical: 10,
            fontSize: 15,
            fontFamily: font.body,
            color: "#0f172a",
            fontWeight: "500",
          }, style]}
          placeholderTextColor="#94a3b8"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      {error && (
        <Text style={{
          fontSize: 12,
          fontFamily: font.body,
          color: "#ef4444",
          fontWeight: "500",
          paddingLeft: 4,
          marginTop: -2,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
}
