import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Activity, AlertTriangle, Database } from "lucide-react";

// ─────────────────────────────────────────────
// CONFIGURATION – edit these values freely
// ─────────────────────────────────────────────
const FLEET_HEALTH_URL = "https://www.staex.io/fleet-management";
const ON_CHAIN_DATA_URL = "https://tc.staex.io/#stats";

const TILES = [
  {
    id: "fleet-health",
    label: "Fleet Health",
    subtitle: "Monitor bus status & diagnostics",
    icon: Activity,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-200",
    action: "url",
    target: FLEET_HEALTH_URL,
  },
  {
    id: "report-damage",
    label: "Report Bus Damage",
    subtitle: "Document & submit damage reports",
    icon: AlertTriangle,
    gradient: "from-rose-500 to-red-600",
    shadow: "shadow-rose-200",
    action: "page",
    target: "ReportDamage",
  },
  {
    id: "on-chain-data",
    label: "On Chain Data",
    subtitle: "View blockchain-stored fleet records",
    icon: Database,
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-200",
    action: "url",
    target: ON_CHAIN_DATA_URL,
  },
];
// ─────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();

  const handleTile = (tile) => {
    if (tile.id === "report-damage") {
      const params = new URLSearchParams({
        busId: "BUS-102",
        driverName: "Driver A",
        incidentDate: new Date().toISOString(),
        damageLocation: "Rear bumper",
        severity: "medium",
        callback: "staex://damage-result",
      });

      const deepLink = `endphoto://capture?${params.toString()}`;
      alert(deepLink);
      window.location.href = deepLink;
      return;
    }

    if (tile.action === "url") {
      window.open(tile.target, "_blank");
    } else {
      navigate(createPageUrl(tile.target));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="px-6 pt-14 pb-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-1">
          Fleet Management
        </p>
        <h1 className="text-3xl font-bold text-white leading-tight">
          Dashboard
        </h1>
      </header>

      <main className="flex-1 px-5 flex flex-col gap-5 pb-10">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              onClick={() => handleTile(tile)}
              className={`
                relative w-full rounded-3xl overflow-hidden
                bg-gradient-to-br ${tile.gradient}
                shadow-xl ${tile.shadow}
                active:scale-[0.97] transition-transform duration-150
                text-left
              `}
            >
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-black/10" />

              <div className="relative z-10 p-8">
                <div className="bg-white/20 rounded-2xl w-14 h-14 flex items-center justify-center mb-6">
                  <Icon size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{tile.label}</h2>
                <p className="text-white/70 text-sm">{tile.subtitle}</p>

                <div className="mt-8 flex items-center gap-1.5">
                  <span className="text-white/90 text-sm font-medium">Open</span>
                  <svg
                    className="w-4 h-4 text-white/90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </main>

      <footer className="pb-8 text-center">
        <p className="text-gray-700 text-xs tracking-wide">Fleet Operations · 2026</p>
      </footer>
    </div>
  );
}