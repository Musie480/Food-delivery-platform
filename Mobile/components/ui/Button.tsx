import {
  type PressableProps,
  type ViewStyle,
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { font } from "../../src/theme";

interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  containerStyle?: ViewStyle;
}

const variants = {
  primary: {
    container: { backgroundColor: "#f97316" },
    text: { color: "#fff" },
    iconBg: "rgba(255,255,255,0.2)",
    shadow: {
      shadowColor: "#f97316",
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    }
  },
  secondary: {
    container: { backgroundColor: "#f1f5f9" },
    text: { color: "#0f172a" },
    iconBg: "rgba(0,0,0,0.05)",
    shadow: {}
  },
  outline: {
    container: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: "#e2e8f0" },
    text: { color: "#475569" },
    iconBg: "rgba(0,0,0,0.05)",
    shadow: {}
  },
} as const;

const sizes = {
  sm: { paddingHorizontal: 14, paddingVertical: 8, fontSize: 13, icon: 20 },
  md: { paddingHorizontal: 20, paddingVertical: 12, fontSize: 15, icon: 24 },
  lg: { paddingHorizontal: 26, paddingVertical: 14, fontSize: 16, icon: 26 },
} as const;

export function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  iconPosition = "right",
  children,
  disabled,
  containerStyle,
  ...props
}: ButtonProps) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 9999,
        opacity: pressed ? 0.85 : disabled || loading ? 0.6 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        ...v.container,
        paddingHorizontal: s.paddingHorizontal,
        paddingVertical: s.paddingVertical,
        ...v.shadow,
        ...containerStyle,
      })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text.color} />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text style={{
            fontFamily: font.body,
            fontWeight: "700",
            fontSize: s.fontSize,
            letterSpacing: 0.3,
            ...v.text,
          }}>
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <View style={{
              width: s.icon,
              height: s.icon,
              borderRadius: 9999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: v.iconBg,
            }}>
              {icon}
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
