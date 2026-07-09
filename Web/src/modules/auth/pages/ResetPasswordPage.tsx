import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { AuthLayout } from "../components/AuthLayout";
import { resetPasswordSchema } from "../../../features/auth/validators";
import { useResetPassword } from "../../../features/auth/hooks";
import type { ResetPasswordInput } from "../../../types/auth";

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const reset = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: ResetPasswordInput) => {
    if (token) reset.mutate({ token, data });
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter your new password below"
      mode="reset"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="New password"
          type="password"
          placeholder="At least 6 characters"
          icon={<Lock size={16} />}
          error={errors.password?.message}
          register={register("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="Repeat your password"
          icon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          register={register("confirmPassword")}
        />
        <Button
          type="submit"
          className="w-full"
          loading={reset.isPending}
          disabled={!isValid}
          icon={<ArrowRight size={14} />}
        >
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}
