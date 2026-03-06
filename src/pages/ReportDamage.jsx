import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { api } from "@/api/client";

// ─────────────────────────────────────────────
// FORM CONFIGURATION – extend or modify freely
// ─────────────────────────────────────────────
const DAMAGE_LOCATIONS = [
  "Front",
  "Rear",
  "Left Side",
  "Right Side",
  "Interior",
  "Roof",
  "Undercarriage",
  "Other",
];

const SEVERITY_LEVELS = ["Minor", "Moderate", "Severe", "Critical"];
// ─────────────────────────────────────────────

const INITIAL = {
  bus_number: "",
  driver_name: "",
  damage_location: "",
  severity: "",
  damage_description: "",
  incident_date: new Date().toISOString().slice(0, 10),
  photo_urls: [],
  proof_status: "",
  proof_tx_hash: "",
  proof_id: "",
  proof_image_url: "",
};

export default function ReportDamage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => {
    const loadDamageResult = () => {
      const saved = localStorage.getItem("damageResult");
      if (!saved) return;

      try {
        const result = JSON.parse(saved);

        setForm((f) => ({
          ...f,
          proof_status: result.status || "",
          proof_tx_hash: result.txHash || "",
          proof_id: result.proofId || "",
          proof_image_url: result.imageUrl || "",
          photo_urls: result.imageUrl ? [result.imageUrl] : f.photo_urls,
        }));
      } catch (error) {
        console.error("Failed to load damage result:", error);
      }
    };

    loadDamageResult();
    window.addEventListener("damageResultUpdated", loadDamageResult);

    return () => {
      window.removeEventListener("damageResultUpdated", loadDamageResult);
    };
  }, []);

  const openEndPhotoFlow = () => {
    const params = new URLSearchParams({
      busId: form.bus_number || "",
      driverName: form.driver_name || "",
      incidentDate: form.incident_date || "",
      damageLocation: form.damage_location || "",
      severity: form.severity || "",
      callback: "staex://damage-result",
    });

    window.location.href = `endphoto://capture?${params.toString()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    await api.entities.DamageReport.create({
      ...form,
      status: "Submitted",
    });

    setSaving(false);
    setSuccess(true);
    localStorage.removeItem("damageResult");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-8 text-center">
        <div className="bg-emerald-500/10 rounded-full p-6 mb-6">
          <CheckCircle2 size={52} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Report Submitted</h2>
        <p className="text-gray-400 text-sm mb-10">
          Your damage report has been sent successfully.
        </p>
        <button
          onClick={() => {
            setForm(INITIAL);
            setSuccess(false);
            navigate(createPageUrl("Home"));
          }}
          className="bg-white text-gray-950 font-semibold px-8 py-3.5 rounded-2xl text-sm active:scale-95 transition-transform"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button
          onClick={() => navigate(createPageUrl("Home"))}
          className="p-2 rounded-xl bg-gray-800 active:bg-gray-700 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Fleet Management
          </p>
          <h1 className="text-xl font-bold text-white">Report Bus Damage</h1>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-5 pb-12 space-y-6 overflow-y-auto">
        <Field label="Bus Number">
          <input
            required
            value={form.bus_number}
            onChange={(e) => set("bus_number", e.target.value)}
            placeholder="e.g. BUS-042"
            className="input"
          />
        </Field>

        <Field label="Driver Name">
          <input
            value={form.driver_name}
            onChange={(e) => set("driver_name", e.target.value)}
            placeholder="Your name (optional)"
            className="input"
          />
        </Field>

        <Field label="Incident Date">
          <input
            type="date"
            value={form.incident_date}
            onChange={(e) => set("incident_date", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Damage Location">
          <div className="grid grid-cols-2 gap-2">
            {DAMAGE_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => set("damage_location", loc)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                  form.damage_location === loc
                    ? "bg-rose-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Severity">
          <div className="grid grid-cols-2 gap-2">
            {SEVERITY_LEVELS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("severity", s)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                  form.severity === s
                    ? "bg-rose-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Description">
          <textarea
            required
            rows={4}
            value={form.damage_description}
            onChange={(e) => set("damage_description", e.target.value)}
            placeholder="Describe the damage in detail…"
            className="input resize-none"
          />
        </Field>

        <Field label="Photo Verification">
          <button
            type="button"
            onClick={openEndPhotoFlow}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-base active:scale-[0.97] transition-all"
          >
            Open END Photo Verifier
          </button>

          {form.proof_status && (
            <div className="mt-4 rounded-xl bg-gray-800 p-4 text-sm text-gray-300 space-y-2">
              <p>
                <span className="font-semibold text-white">Status:</span>{" "}
                {form.proof_status}
              </p>
              {form.proof_tx_hash && (
                <p>
                  <span className="font-semibold text-white">Tx Hash:</span>{" "}
                  {form.proof_tx_hash}
                </p>
              )}
              {form.proof_id && (
                <p>
                  <span className="font-semibold text-white">Proof ID:</span>{" "}
                  {form.proof_id}
                </p>
              )}
              {form.proof_image_url && (
                <p className="break-all">
                  <span className="font-semibold text-white">Image URL:</span>{" "}
                  {form.proof_image_url}
                </p>
              )}
            </div>
          )}
        </Field>

        <button
          type="submit"
          disabled={
            saving ||
            !form.bus_number ||
            !form.damage_location ||
            !form.damage_description
          }
          className="w-full py-4 rounded-2xl bg-rose-600 text-white font-bold text-base disabled:opacity-40 active:scale-[0.97] transition-all"
        >
          {saving ? "Submitting…" : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}