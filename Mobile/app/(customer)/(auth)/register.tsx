import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, User, ArrowRight } from "lucide-react-native";
import { toast } from "sonner-native";
import { font } from "../../../src/theme";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { PhoneInput } from "../../../components/ui/PhoneInput";
import { authApi } from "../../../src/api/auth";
import { useAuthStore } from "../../../src/store/authStore";

const schema = z.object({
  name: z.string().min(1, "Full Name is required").min(2, "Name must be at least 2 characters"),
  phone: z.string().min(1, "Phone number is required").regex(/^\+251\d{9}$/, "Enter a valid phone number"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

type Form = z.infer<typeof schema>;

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "driver">("customer");
  const setAuth = useAuthStore((s) => s.setAuth);

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authApi.register({ ...data, role });
      setAuth(res.user, res.accessToken);
      toast.success("Account created successfully!");
      router.replace("/(customer)/(tabs)");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us today and get your favorite meals delivered fast."
    >
      <View style={{ gap: 20 }}>
        {/* Role Selector */}
        <View style={{
          flexDirection: "row",
          backgroundColor: "#f8fafc",
          borderRadius: 16,
          padding: 6,
          borderWidth: 1,
          borderColor: "#f1f5f9"
        }}>
          {(["customer", "driver"] as const).map((r) => {
            const isActive = role === r;
            return (
              <Pressable
                key={r}
                onPress={() => setRole(r)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor: isActive ? "#fff" : "transparent",
                  shadowColor: isActive ? "#000" : "transparent",
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: isActive ? 2 : 0,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: isActive ? "800" : "600",
                  color: isActive ? "#f97316" : "#64748b",
                  textTransform: "capitalize",
                }}>
                  {r}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              icon={<User size={18} color="#a3a3a3" />}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <PhoneInput
              label="Phone Number"
              error={errors.phone?.message}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="At least 6 characters"
              secureTextEntry
              error={errors.password?.message}
              icon={<Lock size={18} color="#a3a3a3" />}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <View style={{ marginTop: 12 }}>
          <Button
            size="lg"
            loading={loading}
            icon={<ArrowRight size={16} color="#fff" />}
            onPress={handleSubmit(onSubmit)}
          >
            Create Account
          </Button>
        </View>

        <View style={{ marginTop: 12, alignItems: "center" }}>
          <Link href="/(customer)/(auth)/login" asChild>
            <Text style={{
              textAlign: "center",
              fontSize: 14,
              fontFamily: font.body,
              color: "#64748b",
            }}>
              Already have an account?{" "}
              <Text style={{
                color: "#f97316",
                fontWeight: "700",
                fontFamily: font.body,
              }}>
                Sign In
              </Text>
            </Text>
          </Link>
        </View>
      </View>
    </AuthLayout>
  );
}
