import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User, ArrowRight, Store, UserCircle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { PhoneInput } from "../../../components/ui/PhoneInput";
import { AuthLayout } from "../components/AuthLayout";
import { RegistrationConfirmModal } from "../components/RegistrationConfirmModal";
import { registerSchema } from "../../../features/auth/validators";
import { clsx } from "clsx";
import type { RegisterInput } from "../../../types/auth";

const roles = [
  { value: "customer", label: "Customer", icon: UserCircle },
  { value: "driver", label: "Driver", icon: Store },
] as const;

export function RegisterPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterInput | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "customer" },
    mode: "onBlur",
  });

  const selectedRole = watch("role");

  const onSubmit = (input: RegisterInput) => {
    setPendingData(input);
    setShowConfirm(true);
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Choose your account type and get started"
      mode="register"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = selectedRole === role.value;
            return (
              <button
                type="button"
                key={role.value}
                onClick={() => setValue("role", role.value, { shouldValidate: true })}
                className={clsx(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  isActive
                    ? "border-primary-500 bg-primary-50 text-primary-600 ring-2 ring-primary-500/10"
                    : "border-surface-200 bg-white text-surface-500 hover:border-surface-300 hover:text-surface-700",
                )}
              >
                <Icon size={24} />
                <span className="text-sm font-medium">{role.label}</span>
              </button>
            );
          })}
        </div>

        <Input
          label="Full name"
          placeholder="John Doe"
          icon={<User size={16} />}
          error={errors.name?.message}
          register={register("name")}
        />

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
          placeholder="At least 6 characters"
          icon={<Lock size={16} />}
          error={errors.password?.message}
          register={register("password")}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid}
          icon={<ArrowRight size={14} />}
        >
          Create account
        </Button>
      </form>

      {pendingData && (
        <RegistrationConfirmModal
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          data={pendingData}
        />
      )}
    </AuthLayout>
  );
}
