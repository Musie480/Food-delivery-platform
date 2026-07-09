import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { PhoneInput } from "../../../components/ui/PhoneInput";
import { AuthLayout } from "../components/AuthLayout";
import { forgotPasswordSchema } from "../../../features/auth/validators";
import { useForgotPassword } from "../../../features/auth/hooks";
import type { ForgotPasswordInput } from "../../../types/auth";

export function ForgotPasswordPage() {
  const forgot = useForgotPassword();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = (input: ForgotPasswordInput) => forgot.mutate(input);

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your phone number and we'll send a reset code"
      mode="forgot"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <PhoneInput
          label="Phone number"
          placeholder="91 123 4567"
          error={errors.phone?.message}
          register={register("phone")}
          setValue={setValue}
        />
        <Button
          type="submit"
          className="w-full"
          loading={forgot.isPending}
          disabled={!isValid}
          icon={<ArrowRight size={14} />}
        >
          Send reset code
        </Button>
      </form>
    </AuthLayout>
  );
}
