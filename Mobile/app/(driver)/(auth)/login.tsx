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
  phone: z.string().regex(/^\+251\d{9}$/, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Form = z.infer<typeof schema>;

export default function DriverLoginScreen() {
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
      router.replace("/(driver)/(tabs)");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid phone or password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Driver sign in"
      subtitle="Sign in to start delivering"
    >
      <View style={{ gap: 18 }}>
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <PhoneInput
              label="Phone number"
              placeholder="91 123 4567"
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
              icon={<Lock size={16} color="#a3a3a3" />}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Link href="/(customer)/(auth)/forgot-password" asChild>
          <Text style={{
            textAlign: "right",
            fontSize: 13,
            fontFamily: font.body,
            color: "#737373",
          }}>
            Forgot password?
          </Text>
        </Link>
        <View style={{ marginTop: 4 }}>
          <Button
            loading={loading}
            icon={<ArrowRight size={14} color="#fff" />}
            onPress={handleSubmit(onSubmit)}
          >
            Sign in
          </Button>
        </View>
      </View>
    </AuthLayout>
  );
}
