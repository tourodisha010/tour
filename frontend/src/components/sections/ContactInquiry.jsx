import { useState } from "react";
import { api, formatApiErrorDetail } from "@/lib/apiClient";
import { toast } from "sonner";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const WA_NUMBER = "917077006689"; // country code + number, no +
const PHONE = "7077006689";
const EMAIL = "tourodisha010@gmail.com";

export default function ContactInquiry() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/inquiries", { ...form, message: "" });
      toast.success("Thank you — we'll reach out within a day.", { description: `A local expert will call you at ${form.phone}` });
      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-cream" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-5">
          <div className="overline text-terracotta">Begin your journey</div>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-ink leading-[1.05] tracking-tight">
            Tell us <em className="not-italic text-terracotta">what stirs you</em>
            <br />— we'll compose the rest.
          </h2>
          <p className="mt-6 text-ink-soft leading-relaxed max-w-md">
            Share a few details and a local planner in Bhubaneshwar will respond within one working
            day with a hand-shaped itinerary.
          </p>

          <div className="mt-10 space-y-5 text-ink">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-terracotta/10 grid place-items-center text-terracotta"><MapPin size={16}/></span>
              <div>
                <div className="overline text-ink-soft">Office</div>
                <div className="font-serif text-lg">Bhubaneshwar, Odisha</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-terracotta/10 grid place-items-center text-terracotta"><Phone size={16}/></span>
              <div>
                <div className="overline text-ink-soft">Call</div>
                <a href={`tel:${PHONE}`} data-testid="contact-phone" className="font-serif text-lg hover:text-terracotta">{PHONE}</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-jade/15 grid place-items-center text-jade"><MessageCircle size={16}/></span>
              <div>
                <div className="overline text-ink-soft">WhatsApp</div>
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="contact-whatsapp"
                  className="font-serif text-lg hover:text-jade"
                >
                  {PHONE}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-terracotta/10 grid place-items-center text-terracotta"><Mail size={16}/></span>
              <div>
                <div className="overline text-ink-soft">Email</div>
                <a href={`mailto:${EMAIL}`} data-testid="contact-email" className="font-serif text-lg hover:text-terracotta break-all">{EMAIL}</a>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-7 bg-surface border border-warm p-8 lg:p-10 self-start" data-testid="inquiry-form">
          <div className="overline text-terracotta">Enquiry</div>
          <h3 className="mt-2 font-serif text-3xl text-ink tracking-tight">Leave your details</h3>
          <p className="mt-2 text-sm text-ink-soft">We'll get back within one working day.</p>

          <div className="mt-8 grid gap-5">
            <Field label="Your name" required>
              <input required data-testid="input-name" value={form.name} onChange={update("name")} className="eo-input" placeholder="Ananya Rao" />
            </Field>
            <Field label="Email" required>
              <input required type="email" data-testid="input-email" value={form.email} onChange={update("email")} className="eo-input" placeholder="you@email.com" />
            </Field>
            <Field label="Phone" required>
              <input required data-testid="input-phone" value={form.phone} onChange={update("phone")} className="eo-input" placeholder="+91 ·······" />
            </Field>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-ink-soft max-w-sm">Your details stay with our Bhubaneshwar office only.</p>
            <button type="submit" disabled={submitting} data-testid="inquiry-submit-button" className="btn-primary rounded-full px-8 py-3.5 text-sm disabled:opacity-60">
              {submitting ? "Sending…" : "Send enquiry"}
            </button>
          </div>
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
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="overline text-ink-soft">{label}{required && <span className="text-terracotta"> *</span>}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
