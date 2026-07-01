import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatApiErrorDetail } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { LogOut, Mail, Phone, Calendar, Users, Trash2, RefreshCw } from "lucide-react";

const STATUSES = ["all", "new", "contacted", "booked", "closed"];

const STATUS_COLORS = {
  new: "bg-terracotta text-cream",
  contacted: "bg-jade text-cream",
  booked: "bg-indigo-deep text-cream",
  closed: "bg-ink/70 text-cream",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, booked: 0 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [inq, st] = await Promise.all([
        api.get(`/admin/inquiries${filter !== "all" ? `?status_filter=${filter}` : ""}`),
        api.get("/admin/stats"),
      ]);
      setItems(inq.data);
      setStats(st.data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/admin/inquiries/${id}`, { status });
      setItems((arr) => arr.map((x) => x.id === id ? data : x));
      if (selected?.id === id) setSelected(data);
      toast.success(`Marked as ${status}`);
      const st = await api.get("/admin/stats");
      setStats(st.data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Update failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    try {
      await api.delete(`/admin/inquiries/${id}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Deleted");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Delete failed");
    }
  };

  const doLogout = () => { logout(); navigate("/admin/login"); };

  const formatDate = (s) => {
    try { return new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return s; }
  };

  const filteredCount = useMemo(() => items.length, [items]);

  return (
    <div className="min-h-screen bg-cream" data-testid="admin-dashboard">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-indigo-deep text-cream p-8">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-terracotta grid place-items-center text-cream font-serif text-2xl font-bold leading-none">T</span>
            <span className="font-serif text-2xl font-bold">Tour Odisha</span>
          </div>
          <div className="mt-2 overline text-cream/50">Admin Console</div>

          <div className="mt-10 space-y-1">
            <div className="overline text-cream/50 mb-3">Overview</div>
            <StatRow label="Total" value={stats.total} />
            <StatRow label="New" value={stats.new} accent />
            <StatRow label="Contacted" value={stats.contacted} />
            <StatRow label="Booked" value={stats.booked} />
          </div>

          <div className="mt-auto pt-8 border-t border-cream/10">
            <div className="text-sm text-cream/80">{user?.email}</div>
            <button onClick={doLogout} data-testid="admin-logout" className="mt-4 inline-flex items-center gap-2 text-sm text-cream/70 hover:text-terracotta transition-colors">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-h-screen">
          <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur border-b border-warm px-6 lg:px-10 py-5 flex items-center justify-between">
            <div>
              <div className="overline text-terracotta">Inbox</div>
              <h1 className="font-serif text-3xl text-ink tracking-tight">Inquiries</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchAll} data-testid="refresh-btn" className="btn-outline rounded-full px-4 py-2 text-xs inline-flex items-center gap-2">
                <RefreshCw size={13} /> Refresh
              </button>
              <button onClick={doLogout} className="lg:hidden btn-outline rounded-full px-4 py-2 text-xs">
                Sign out
              </button>
            </div>
          </header>

          <div className="px-6 lg:px-10 py-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  data-testid={`filter-${s}`}
                  className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border transition-all ${filter === s ? "bg-ink text-cream border-ink" : "border-warm text-ink-soft hover:border-ink hover:text-ink"}`}
                >
                  {s}
                </button>
              ))}
              <span className="ml-auto text-xs text-ink-soft self-center" data-testid="results-count">{filteredCount} results</span>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <div className="border border-warm bg-surface">
                  {loading ? (
                    <div className="p-10 overline text-ink-soft">Loading…</div>
                  ) : items.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="font-serif text-2xl text-ink">No inquiries yet</div>
                      <p className="mt-2 text-sm text-ink-soft">When travellers reach out, their notes will appear here.</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-[color:var(--eo-border)]">
                      {items.map((it) => (
                        <li
                          key={it.id}
                          onClick={() => setSelected(it)}
                          data-testid={`inquiry-row-${it.id}`}
                          className={`p-5 cursor-pointer transition-colors ${selected?.id === it.id ? "bg-cream" : "hover:bg-cream/70"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-serif text-xl text-ink">{it.name}</div>
                              <div className="text-xs text-ink-soft mt-1">{it.email} · {it.phone}</div>
                            </div>
                            <span className={`px-2.5 py-1 text-[10px] tracking-widest uppercase rounded-full ${STATUS_COLORS[it.status] || "bg-ink/70 text-cream"}`}>
                              {it.status}
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-ink-soft line-clamp-2">{it.message}</div>
                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-soft">
                            {it.package && <span>· {it.package}</span>}
                            {it.travel_date && <span>· Travel: {it.travel_date}</span>}
                            <span className="ml-auto">{formatDate(it.created_at)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-24 border border-warm bg-surface p-6">
                  {!selected ? (
                    <div className="text-sm text-ink-soft" data-testid="inquiry-empty">Select an inquiry to see details.</div>
                  ) : (
                    <div data-testid="inquiry-detail">
                      <div className="overline text-terracotta">Inquiry</div>
                      <h2 className="mt-2 font-serif text-3xl text-ink tracking-tight">{selected.name}</h2>
                      <div className="mt-4 space-y-2 text-sm text-ink">
                        <div className="flex items-center gap-2"><Mail size={14} className="text-ink-soft"/> <a href={`mailto:${selected.email}`} className="hover:text-terracotta">{selected.email}</a></div>
                        <div className="flex items-center gap-2"><Phone size={14} className="text-ink-soft"/> <a href={`tel:${selected.phone}`} className="hover:text-terracotta">{selected.phone}</a></div>
                        <div className="flex items-center gap-2"><Calendar size={14} className="text-ink-soft"/> {selected.travel_date || "Flexible"}</div>
                        <div className="flex items-center gap-2"><Users size={14} className="text-ink-soft"/> {selected.guests || 1} traveller(s)</div>
                      </div>

                      <div className="mt-6">
                        <div className="overline text-ink-soft">Package interested</div>
                        <div className="mt-1 text-ink">{selected.package || "—"}</div>
                      </div>
                      <div className="mt-5">
                        <div className="overline text-ink-soft">Message</div>
                        <p className="mt-2 text-ink leading-relaxed whitespace-pre-line">{selected.message}</p>
                      </div>
                      <div className="mt-5">
                        <div className="overline text-ink-soft">Received</div>
                        <div className="mt-1 text-sm text-ink">{formatDate(selected.created_at)}</div>
                      </div>

                      <div className="mt-8">
                        <div className="overline text-ink-soft mb-3">Update status</div>
                        <div className="flex flex-wrap gap-2">
                          {["new", "contacted", "booked", "closed"].map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(selected.id, s)}
                              data-testid={`set-status-${s}`}
                              className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all ${selected.status === s ? STATUS_COLORS[s] : "border border-warm text-ink hover:border-ink"}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => remove(selected.id)}
                        data-testid="delete-inquiry"
                        className="mt-8 inline-flex items-center gap-2 text-xs text-destructive hover:text-terracotta transition-colors"
                      >
                        <Trash2 size={14} /> Delete inquiry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-cream/75">{label}</span>
      <span className={`font-serif text-2xl ${accent ? "text-terracotta" : "text-cream"}`}>{value}</span>
    </div>
  );
}
