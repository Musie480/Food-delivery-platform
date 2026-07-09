import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
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
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+251\d{9}$/, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Form = z.infer<typeof schema>;

export default function DriverRegisterScreen() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authApi.register({ ...data, role: "driver" });
      setAuth(res.user, res.accessToken);
      router.replace("/(driver)/(tabs)");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Become a driver"
      subtitle="Sign up to start earning"
    >
      <View style={{ gap: 16 }}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full name"
              placeholder="John Doe"
              error={errors.name?.message}
              icon={<User size={16} color="#a3a3a3" />}
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
              placeholder="At least 6 characters"
              secureTextEntry
              error={errors.password?.message}
              icon={<Lock size={16} color="#a3a3a3" />}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Button
          loading={loading}
          icon={<ArrowRight size={14} color="#fff" />}
          onPress={handleSubmit(onSubmit)}
        >
          Create account
        </Button>
      </View>
    </AuthLayout>
  );
}
