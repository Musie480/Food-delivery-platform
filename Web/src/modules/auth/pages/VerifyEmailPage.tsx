import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { authService } from "../../../services/auth";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

type Status = "verifying" | "success" | "error";

export function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    authService
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="rounded-[calc(2rem-0.375rem)] bg-white p-10 shadow-xl shadow-black/[0.02] ring-1 ring-black/[0.03]">
          {status === "verifying" && (
            <div className="space-y-4">
              <LoadingSpinner size="lg" className="mx-auto" />
              <p className="text-sm text-surface-500">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="mx-auto text-green-500" size={48} />
              <h1 className="text-xl font-semibold text-surface-900">
                Email verified!
              </h1>
              <p className="text-sm text-surface-500">
                Your email has been successfully verified.
              </p>
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 transition-colors duration-300 hover:text-primary-600"
              >
                Sign in to your account
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <XCircle className="mx-auto text-red-500" size={48} />
              <h1 className="text-xl font-semibold text-surface-900">
                Verification failed
              </h1>
              <p className="text-sm text-surface-500">
                This link is invalid or expired.
              </p>
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 transition-colors duration-300 hover:text-primary-600"
              >
                Go back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
