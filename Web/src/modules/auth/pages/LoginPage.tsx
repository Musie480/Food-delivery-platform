import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { PhoneInput } from "../../../components/ui/PhoneInput";
import { AuthLayout } from "../components/AuthLayout";
import { loginSchema } from "../../../features/auth/validators";
import { useLogin } from "../../../features/auth/hooks";
import type { LoginInput } from "../../../types/auth";

export function LoginPage() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = (input: LoginInput) => login.mutate(input);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      mode="login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <PhoneInput
          label="Phone number"
          placeholder="91 123 4567"
          error={errors.phone?.message}
          register={register("phone")}
          setValue={setValue}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<Lock size={16} />}
          error={errors.password?.message}
          register={register("password")}
        />
        <div className="flex items-center justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-surface-500 transition-colors duration-300 hover:text-primary-500"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full"
          loading={login.isPending}
          disabled={!isValid}
          icon={<ArrowRight size={14} />}
        >
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
