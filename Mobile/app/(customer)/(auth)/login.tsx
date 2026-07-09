import { useState } from "react";
import { Text, View } from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, ArrowRight } from "lucide-react-native";
import { toast } from "sonner-native";
import { font } from "../../../src/theme";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { PhoneInput } from "../../../components/ui/PhoneInput";
import { authApi } from "../../../src/api/auth";
import { useAuthStore } from "../../../src/store/authStore";

const schema = z.object({
  phone: z.string().min(1, "Phone number is required").regex(/^\+251\d{9}$/, "Enter a valid phone number"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

type Form = z.infer<typeof schema>;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      setAuth(res.user, res.accessToken);
      toast.success("Welcome back!");
      router.replace("/(customer)/(tabs)");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid phone or password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue ordering your favorite meals."
    >
      <View style={{ gap: 20 }}>
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <PhoneInput
              label="Phone number"
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
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password?.message}
              icon={<Lock size={18} color="#a3a3a3" />}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        
        <View style={{ marginTop: -8 }}>
          <Link href="/(customer)/(auth)/forgot-password" asChild>
            <Text style={{
              textAlign: "right",
              fontSize: 13,
              fontFamily: font.body,
              fontWeight: "600",
              color: "#f97316",
            }}>
              Forgot password?
            </Text>
          </Link>
        </View>

        <View style={{ marginTop: 12 }}>
          <Button
            size="lg"
            loading={loading}
            icon={<ArrowRight size={16} color="#fff" />}
            onPress={handleSubmit(onSubmit)}
          >
            Sign In
          </Button>
        </View>

        <View style={{ marginTop: 12, alignItems: "center" }}>
          <Link href="/(customer)/(auth)/register" asChild>
            <Text style={{
              textAlign: "center",
              fontSize: 14,
              fontFamily: font.body,
              color: "#64748b",
            }}>
              Don't have an account?{" "}
              <Text style={{
                color: "#f97316",
                fontWeight: "700",
                fontFamily: font.body,
              }}>
                Sign Up
              </Text>
            </Text>
          </Link>
        </View>
      </View>
    </AuthLayout>
  );
}
