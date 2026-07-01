import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiErrorDetail } from "@/lib/apiClient";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/admin");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6" data-testid="admin-login-page">
      <div className="absolute top-6 left-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-terracotta transition-colors" data-testid="back-to-site">
          <ArrowLeft size={16} /> Back to site
        </Link>
      </div>

      <div className="w-full max-w-md bg-surface border border-warm p-10">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-terracotta grid place-items-center text-cream font-serif text-2xl font-bold leading-none">T</span>
          <span className="font-serif text-3xl font-bold">Tour Odisha</span>
        </div>
        <div className="mt-8">
          <div className="overline text-terracotta">Admin</div>
          <h1 className="mt-2 font-serif text-4xl text-ink tracking-tight">Sign in</h1>
          <p className="mt-3 text-sm text-ink-soft">Manage inquiries and traveller leads.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="overline text-ink-soft">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="admin-email-input"
              className="eo-input mt-2"
              placeholder="admin@exploreodisha.com"
            />
          </label>
          <label className="block">
            <span className="overline text-ink-soft">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-password-input"
              className="eo-input mt-2"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="btn-primary w-full rounded-full py-3.5 text-sm disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <style>{`
        .eo-input {
          width: 100%;
          padding: 12px 14px;
          background: var(--eo-cream);
          border: 1px solid var(--eo-border);
          color: var(--eo-ink);
          font-family: 'Manrope', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 300ms ease, box-shadow 300ms ease;
        }
        .eo-input:focus { border-color: var(--eo-terracotta); box-shadow: 0 0 0 3px rgba(200,90,60,0.15); }
      `}</style>
    </div>
  );
}
