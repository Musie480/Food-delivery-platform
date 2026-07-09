import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react-native";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/ui/Button";
import { PhoneInput } from "../../../components/ui/PhoneInput";
import { authApi } from "../../../src/api/auth";

const schema = z.object({
  phone: z.string().regex(/^\+251\d{9}$/, "Enter a valid phone number"),
});

type Form = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data);
      router.back();
    } catch {
      // toast handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your phone number to receive a reset code"
    >
      <View style={{ gap: 20 }}>
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
        <Button
          loading={loading}
          icon={<ArrowRight size={14} color="#fff" />}
          onPress={handleSubmit(onSubmit)}
        >
          Send reset code
        </Button>
      </View>
    </AuthLayout>
  );
}
