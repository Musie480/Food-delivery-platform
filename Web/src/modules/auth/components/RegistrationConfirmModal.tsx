import { useState } from "react";
import { User, Phone, ShieldCheck } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { useRegister } from "../../../features/auth/hooks";
import type { RegisterInput } from "../../../types/auth";

interface Props {
  open: boolean;
  onClose: () => void;
  data: RegisterInput;
}

export function RegistrationConfirmModal({ open, onClose, data }: Props) {
  const register = useRegister();
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    register.mutate(data, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  };

  const handleClose = () => {
    if (register.isPending || success) return;
    onClose();
  };

  const roleLabel = data.role === "customer" ? "Customer" : "Driver";

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="overflow-hidden rounded-[calc(2rem-0.375rem)] bg-white p-8 shadow-2xl ring-1 ring-black/[0.03]">
        {!success ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 ring-1 ring-primary-500/10">
                <ShieldCheck size={24} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-surface-900">
                Confirm your details
              </h2>
              <p className="mt-1 text-sm text-surface-500">
                Please verify your information before continuing
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-surface-50 p-4 ring-1 ring-black/[0.02]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-surface-400 ring-1 ring-black/[0.04]">
                  <User size={16} />
                </span>
                <div>
                  <p className="text-xs text-surface-400">Name</p>
                  <p className="text-sm font-medium text-surface-800">
                    {data.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-surface-400 ring-1 ring-black/[0.04]">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-xs text-surface-400">Phone</p>
                  <p className="text-sm font-medium text-surface-800">
                    {data.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-surface-400 ring-1 ring-black/[0.04]">
                  <User size={16} />
                </span>
                <div>
                  <p className="text-xs text-surface-400">Account type</p>
                  <p className="text-sm font-medium text-surface-800">
                    {roleLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={register.isPending}
              >
                Edit
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirm}
                loading={register.isPending}
              >
                {register.isPending ? "Creating..." : "Continue"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-500/10">
              <svg
                className="h-8 w-8 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline
                  points="20 6 9 17 4 12"
                  strokeDasharray="50"
                  strokeDashoffset="0"
                  style={{
                    animation: "checkmark 500ms cubic-bezier(0.32,0.72,0,1) forwards",
                  }}
                />
              </svg>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-surface-900">
              Account created!
            </h2>
            <p className="mt-1 text-sm text-surface-500">
              Welcome to Keleme Delivery, {data.name.split(" ")[0]}!
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
