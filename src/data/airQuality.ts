// Descriptive content for the ACSM slide; the readings come from @/lib/acsm.
import type { AcsmField } from "@/lib/acsm";

export interface AcsmComponent {
  name: string;
  /** Name used on the stacked bar, which differs slightly from the cards. */
  barName: string;
  /** Field holding this species in the ACSM Firestore documents. */
  field: AcsmField;
  color: string;
  whatAreThey: string;
  effects: string;
}

// The colors only tell the species apart. Green, yellow, orange and red are
// kept for air quality levels, so none of the species use them.
export const acsmComponents: AcsmComponent[] = [
  {
    name: "Organics",
    barName: "Organics",
    field: "Org",
    color: "#1f4e9e",
    whatAreThey:
      "Carbon-based particles from combustion (like vehicle exhaust) and plant processes. Wildfire smoke can also cause spikes in organic particulates in the air.",
    effects:
      "Organics are linked to respiratory irritation and cardiovascular effects.",
  },
  {
    name: "Nitrates",
    barName: "Nitrates",
    field: "NO3",
    color: "#c7458a",
    whatAreThey:
      "Particles formed when nitrogen oxides from activities like fossil fuel combustion and biomass burning react in the atmosphere. Unfortunately the Inland Empire has some of the highest traffic-related pollution in the US.",
    effects:
      "Nitrates are associated with smog formation, and also respiratory issues particularly in children and older adults.",
  },
  {
    name: "Sulfates",
    barName: "Sulfate",
    field: "SO4",
    color: "#2e96dc",
    whatAreThey:
      "Particles formed from sulfur dioxide released by burning fossil fuels like coal and diesel.",
    effects:
      "Long term exposure to sulfates is linked to lung disease. Additionally sulfates can cause acid rain and travel far from their origin source.",
  },
  {
    name: "Ammonium",
    barName: "Ammonium",
    field: "NH4",
    color: "#7a2e6e",
    whatAreThey:
      "Particles formed when ammonia from agriculture reacts with sulfuric or nitric acid. Agricultural regions surrounding the Inland Empire are significant sources of ammonia.",
    effects:
      "Ammonium contributes to haze and reacts with other pollutants to make harmful particles.",
  },
  {
    name: "Chlorides",
    barName: "Chloride",
    field: "Chl",
    color: "#7c3aed",
    whatAreThey:
      "Chlorides are salt based particles from natural and industrial sources. Some chlorides come from sea spray carried inland from the coast, and some come from corporate activities like burning coal.",
    effects:
      "Chlorine can cause breathing issues and contribute to the overall particulate regulation in the air.",
  },
];
