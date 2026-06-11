import { useState, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Strain } from "../types";
import { STRAINS_DATA } from "../data";
import {
  Search,
  Info,
  Award,
  Calendar,
  Microscope,
  Leaf,
  Shield,
  FlaskConical,
  Droplet,
  Sun,
  Compass,
  X,
  Sparkles,
  History,
  Star,
} from "lucide-react";
import CompareModal from "./CompareModal";
import { CompoundTooltip } from "./CompoundTooltip";

interface TerpeneInfo {
  name: string;
  chemicalClass: string;
  boilingPoint: string;
  botanicalSources: string[];
  effects: string[];
  scientificMechanism: string;
  aromaNotes: string;
}

const TERPENES_DATABASE: Record<string, TerpeneInfo> = {
  myrcene: {
    name: "Myrcene",
    chemicalClass: "Monoterpene",
    boilingPoint: "168°C (334°F)",
    botanicalSources: [
      "Mangoes",
      "Lemongrass",
      "Wild Thyme",
      "Hops",
      "Bay Leaves",
    ],
    effects: [
      "Sedative",
      "Muscle relaxation",
      "Eases physical tension",
      "Anti-inflammatory",
    ],
    scientificMechanism:
      "Enhances cell membrane permeability, facilitating much faster passage of therapeutic cannabinoids across the blood-brain barrier. It modulates GABA-A receptors to act as a central muscle relaxant.",
    aromaNotes:
      "Rich damp earth, warm cloves, and sweet tropical mango fruits.",
  },
  pinene: {
    name: "Alpha/Beta-Pinene",
    chemicalClass: "Bicyclic Monoterpene",
    boilingPoint: "155°C (311°F)",
    botanicalSources: [
      "Pine Needles",
      "Rosemary",
      "Dill",
      "Parsley",
      "Basil",
      "Frankincense",
    ],
    effects: [
      "Mental alert and active",
      "Preserves memory access",
      "Bronchodilation",
      "Anti-inflammatory",
    ],
    scientificMechanism:
      "Acts as an acetylcholinesterase inhibitor. By preventing the breakdown of acetylcholine (the learning neurotransmitter), it helps preserve sharp focus and offsets THC-induced short-term memory lapses.",
    aromaNotes:
      "Resinous pine forests, crisp morning air, and green sappy timber.",
  },
  limonene: {
    name: "D-Limonene",
    chemicalClass: "Monocyclic Monoterpene",
    boilingPoint: "176°C (349°F)",
    botanicalSources: [
      "Citrus Rinds (Lemons, Oranges, Grapefruit)",
      "Peppermint",
      "Juniper Berry",
    ],
    effects: [
      "Uplifts low mood",
      "Anxiety mitigation",
      "Stress relief",
      "Impedes gastrointestinal stress",
    ],
    scientificMechanism:
      "Maintains sparse agonism with serotonin (5-HT1A) and dopamine path networks, encouraging healthy adenosine pathway activations to mitigate physical nervous tension and protect systemic tissues.",
    aromaNotes:
      "Vibrant zesty lemons, fresh sweet orange skin, and punchy citric oil.",
  },
  caryophyllene: {
    name: "Beta-Caryophyllene",
    chemicalClass: "Bicyclic Sesquiterpene",
    boilingPoint: "119°C (246°F, vacuum distilled)",
    botanicalSources: [
      "Black Pepper",
      "Cloves",
      "Cinnamon",
      "Oregano",
      "Ylang-Ylang",
    ],
    effects: [
      "Somatic comfort",
      "Decongestion",
      "Immune modulation",
      "Gastrointestinal support",
    ],
    scientificMechanism:
      "The only known terpene class to act as a direct dietary cannabinoid. It selectively binds directly to CB2 immune and peripheral receptors, triggering anti-stress and pain-relieving signals without psychoactivity.",
    aromaNotes:
      "Cracked black peppercorns, warm cedarwood spice, and a sharp woody finish.",
  },
  linalool: {
    name: "Linalool",
    chemicalClass: "Acyclic Monoterpene",
    boilingPoint: "198°C (388°F)",
    botanicalSources: [
      "Lavender",
      "Coriander",
      "Rosewood",
      "Sweet Basil",
      "Birch Bark",
    ],
    effects: [
      "Insomnia relief",
      "Mitigates central stress",
      "Calming",
      "Anti-convulsant traits",
    ],
    scientificMechanism:
      "Extends strong GABA-A receptor modulation to foster mental deceleration and reduce brain excitability, while actively inhibiting glutamate receptors to prompt deep, restful relaxation.",
    aromaNotes:
      "Sweet floral lavender field, soft spring herbs, and warm wood accents.",
  },
  terpinolene: {
    name: "Terpinolene",
    chemicalClass: "Monocyclic Monoterpene",
    boilingPoint: "185°C (365°F)",
    botanicalSources: [
      "Nutmeg",
      "Tea Tree Oil",
      "Pine Cones",
      "Apples",
      "Lilac Blocks",
      "Cumin",
    ],
    effects: [
      "CNS soothing",
      "Sedative (in isolated amounts)",
      "Antioxidant",
      "Antibacterial shield",
    ],
    scientificMechanism:
      "Modulates central nervous system pathways to soothe overall sensory anxiety while acting as a versatile antioxidant and antimicrobial agent to strengthen body homeostasis.",
    aromaNotes:
      "Complex smoky wood, crisp pine bark, sharp herbs, and floral citrus undertones.",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

interface StrainExplorerProps {
  onSelectStrain: (strain: Strain) => void;
  selectedStrain: Strain;
}

export default function StrainExplorer({
  onSelectStrain,
  selectedStrain,
}: StrainExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTaxonomy, setActiveTaxonomy] = useState<string>("All");
  const [comparedStrains, setComparedStrains] = useState<Strain[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("canna_favorite_strains");
      return stored ? JSON.parse(stored) || [] : ["s1", "s3"];
    } catch {
      return ["s1", "s3"];
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem("canna_favorite_strains", JSON.stringify(updated));
      } catch (err) {
        console.error("Diagnostic log: Save favorite failed.");
      }
      return updated;
    });
  };

  // Terpene States
  const [selectedTerpeneFilter, setSelectedTerpeneFilter] =
    useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedTerpeneDetails, setSelectedTerpeneDetails] =
    useState<TerpeneInfo | null>(null);

  // Load and save recently viewed strains from localStorage
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("canna_recently_viewed_ids");
      return stored ? JSON.parse(stored) || [] : [];
    } catch {
      return [];
    }
  });

  const [recentSearchQueries, setRecentSearchQueries] = useState<string[]>(
    () => {
      try {
        const stored = localStorage.getItem("canna_recent_search_queries");
        return stored ? JSON.parse(stored) || [] : [];
      } catch {
        return [];
      }
    },
  );

  // Track selected strain updates to update recently viewed
  useEffect(() => {
    if (!selectedStrain) return;
    setRecentlyViewed((prev) => {
      // Remove if already exists, then prepend
      const filtered = prev.filter((id) => id !== selectedStrain.id);
      const updated = [selectedStrain.id, ...filtered].slice(0, 5); // limit to 5
      try {
        localStorage.setItem(
          "canna_recently_viewed_ids",
          JSON.stringify(updated),
        );
      } catch (err) {
        console.error("Diagnostic log: Save viewed items failed.");
      }
      return updated;
    });
  }, [selectedStrain]);

  // Keep track of search queries
  const saveSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearchQueries((prev) => {
      // Avoid duplicate casing
      const filtered = prev.filter(
        (q) => q.toLowerCase() !== trimmed.toLowerCase(),
      );
      const updated = [trimmed, ...filtered].slice(0, 5); // limit to 5
      try {
        localStorage.setItem(
          "canna_recent_search_queries",
          JSON.stringify(updated),
        );
      } catch (err) {
        console.error("Diagnostic log: Unable to sync recent search queries.");
      }
      return updated;
    });
  };

  const handleCompareToggle = (e: MouseEvent, s: Strain) => {
    e.stopPropagation();
    setComparedStrains((prev) => {
      const exists = prev.some((x) => x.id === s.id);
      if (exists) {
        return prev.filter((x) => x.id !== s.id);
      } else {
        if (prev.length >= 2) {
          return [prev[0], s];
        }
        return [...prev, s];
      }
    });
  };

  const taxonomies = [
    "All",
    "Sativa",
    "Indica",
    "Hybrid",
    "Sativa-Dominant",
    "Indica-Dominant",
  ];

  const filteredStrains = STRAINS_DATA.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.benefits.some((b) =>
        b.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      s.flavors.some((f) =>
        f.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      s.terpenes.some((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesTaxonomy =
      activeTaxonomy === "All" ||
      s.type === activeTaxonomy ||
      (activeTaxonomy === "Sativa" && s.type.includes("Sativa")) ||
      (activeTaxonomy === "Indica" && s.type.includes("Indica"));

    const matchesTerpene =
      selectedTerpeneFilter === "All" ||
      s.terpenes.some(
        (t) => t.name.toLowerCase() === selectedTerpeneFilter.toLowerCase(),
      );

    return matchesSearch && matchesTaxonomy && matchesTerpene;
  });

  const sortedStrains = [...filteredStrains].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "thc-desc") {
      return b.thcValue - a.thcValue;
    }
    if (sortBy === "cbd-desc") {
      return b.cbdValue - a.cbdValue;
    }
    if (sortBy === "terpene-desc") {
      const maxTerpA = Math.max(...a.terpenes.map((t) => t.percentage), 0);
      const maxTerpB = Math.max(...b.terpenes.map((t) => t.percentage), 0);
      return maxTerpB - maxTerpA;
    }
    return 0; // default Order
  });

  return (
    <div
      id="encyclopedia-content-pane"
      className="p-4 md:p-8 pb-32 space-y-6 md:space-y-8 bg-[var(--bg-surface)]/90 border border-[var(--border-regular)] rounded-2xl md:rounded-3xl shadow-2xl relative"
    >
      <div className="absolute top-2 right-2 flex items-center space-x-1 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-mono tracking-widest text-emerald-600 dark:text-[#b87333] uppercase">
        <Microscope className="w-3.5 h-3.5" />
        <span>Taxonomy Labs</span>
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-emerald-500" />
          Botanical Encyclopedia
        </h3>
        <p className="text-xs md:text-sm text-[var(--text-secondary)] font-sans font-medium max-w-2xl leading-relaxed">
          Search and drill down into verified chemical specs, cultivation
          telemetry, and peer-reviewed pharmacology journals for major cannabis
          phenotypes.
        </p>
      </div>

      {/* Filter and Search Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Side: Directory Search List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-3.5" />
            <input
              id="search-strains"
              type="text"
              placeholder="Search terpene, flavor, benefit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveSearchQuery(searchQuery);
                }
              }}
              onBlur={() => {
                saveSearchQuery(searchQuery);
              }}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-regular)] rounded-xl pl-9 pr-4 py-3.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-emerald-500 transition-all font-sans font-medium"
            />
          </div>

          {/* Quick categories list */}
          <div className="flex flex-wrap gap-1.5 py-1">
            {taxonomies.map((cat) => (
              <button
                id={`btn-taxo-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                key={cat}
                type="button"
                onClick={() => setActiveTaxonomy(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-all duration-300 ${
                  activeTaxonomy === cat
                    ? "bg-emerald-500 text-white dark:text-black font-extrabold shadow-md shadow-emerald-500/20"
                    : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-emerald-500/30 font-bold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Recent Operations & History */}
          {(recentlyViewed.length > 0 || recentSearchQueries.length > 0) && (
            <div
              id="recents-container"
              className="p-3 bg-[var(--bg-main)]/40 border border-[var(--border-subtle)] rounded-xl space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-emerald-500 dark:text-[#b87333]" />
                  Recents & History
                </span>
                <button
                  id="btn-clear-history"
                  type="button"
                  onClick={() => {
                    setRecentlyViewed([]);
                    setRecentSearchQueries([]);
                    try {
                      localStorage.removeItem("canna_recently_viewed_ids");
                      localStorage.removeItem("canna_recent_search_queries");
                    } catch {}
                  }}
                  className="text-[8px] font-mono text-[var(--text-muted)] hover:text-rose-500 uppercase font-black tracking-wider transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Recently Searched Phrases */}
              {recentSearchQueries.length > 0 && (
                <div id="recent-queries-pills" className="space-y-1">
                  <span className="text-[8px] font-mono text-[var(--text-secondary)] font-bold uppercase block">
                    Recent Searches
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearchQueries.map((q, idx) => (
                      <button
                        id={`btn-recent-search-${idx}`}
                        key={`${q}-${idx}`}
                        type="button"
                        onClick={() => setSearchQuery(q)}
                        className="px-2 py-1 bg-[var(--bg-surface-elevated)] hover:bg-emerald-500/10 hover:text-emerald-500 border border-[var(--border-subtle)] hover:border-emerald-500/30 text-[9px] text-[var(--text-secondary)] font-mono rounded-md transition-all cursor-pointer flex items-center gap-1 font-medium"
                      >
                        <Search className="w-2.5 h-2.5 text-[var(--text-muted)]" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Viewed Profiles */}
              {recentlyViewed.length > 0 && (
                <div
                  id="recently-viewed-profiles"
                  className="space-y-1 pt-1 border-t border-[var(--border-subtle)]"
                >
                  <span className="text-[8px] font-mono text-[var(--text-secondary)] font-bold uppercase block">
                    Recently Viewed
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recentlyViewed.map((id) => {
                      const strain = STRAINS_DATA.find((s) => s.id === id);
                      if (!strain) return null;
                      const isSelected = strain.id === selectedStrain.id;
                      return (
                        <button
                          id={`btn-recent-viewed-${id}`}
                          key={id}
                          type="button"
                          onClick={() => onSelectStrain(strain)}
                          className={`px-2 py-1 text-[9px] font-mono rounded-md border transition-all cursor-pointer flex items-center gap-1 font-medium ${
                            isSelected
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/40 font-bold"
                              : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-emerald-500/20"
                          }`}
                        >
                          <Leaf className="w-2.5 h-2.5 text-emerald-500" />
                          {strain.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick sorting & terpene filters */}
          <div className="space-y-2 p-3 bg-[var(--bg-main)]/40 border border-[var(--border-subtle)] rounded-xl">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[8.5px] font-mono text-emerald-600 dark:text-emerald-400 block uppercase font-bold tracking-wider">
                  Terpene Focus
                </label>
                <select
                  value={selectedTerpeneFilter}
                  onChange={(e) => setSelectedTerpeneFilter(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-regular)] rounded-lg py-1.5 px-1.5 text-[10.5px] text-[var(--text-primary)] font-mono cursor-pointer focus:outline-none focus:border-emerald-500 hover:border-[var(--border-subtle)] transition-all font-semibold"
                >
                  <option value="All">All Terpenes</option>
                  <option value="Myrcene">Myrcene</option>
                  <option value="Pinene">Pinene</option>
                  <option value="Limonene">Limonene</option>
                  <option value="Caryophyllene">Caryophyllene</option>
                  <option value="Linalool">Linalool</option>
                  <option value="Terpinolene">Terpinolene</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] font-mono text-emerald-600 dark:text-[#b87333] block uppercase font-bold tracking-wider">
                  Sort Catalog
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-regular)] rounded-lg py-1.5 px-1.5 text-[10.5px] text-[var(--text-primary)] font-mono cursor-pointer focus:outline-none focus:border-emerald-500 hover:border-[var(--border-subtle)] transition-all font-semibold"
                >
                  <option value="default">Default Order</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="thc-desc">THC Level</option>
                  <option value="cbd-desc">CBD Level</option>
                  <option value="terpene-desc">Terpene Vol</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cultivar matching list */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto custom-scroll pr-1 pb-4">
            {sortedStrains.length > 0 ? (
              <motion.div
                key={`${activeTaxonomy}-${selectedTerpeneFilter}-${sortBy}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {sortedStrains.map((strain) => {
                  const isSelected = strain.id === selectedStrain.id;
                  return (
                    <motion.div
                      id={`strain-card-${strain.id}`}
                      key={strain.id}
                      layout
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.015,
                        y: -3,
                        boxShadow:
                          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                        transition: { duration: 0.2, ease: "easeOut" },
                      }}
                      onClick={() => onSelectStrain(strain)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                        isSelected
                          ? "bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/5"
                          : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-emerald-500/30 hover:bg-[var(--bg-main)]"
                      }`}
                    >
                      {/* Glowing highlight indicator */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                      )}

                      <div className="flex justify-between items-start">
                        <div className="overflow-hidden">
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-bold rounded">
                            {strain.type}
                          </span>
                          <h4 className="font-display font-black text-sm text-[var(--text-primary)] mt-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors truncate">
                            {strain.name}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-[var(--text-secondary)] font-bold block relative">
                            <CompoundTooltip compoundKey="thc">
                              <span className="cursor-help pb-0.5 border-b border-dashed border-[var(--border-subtle)] hover:border-amber-500">THC</span>
                            </CompoundTooltip>:{" "}
                            <strong className="text-amber-500 font-bold">
                              {strain.cannabinoids.thc.replace(/% - /g, "-")}
                            </strong>
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-secondary)] font-bold block relative">
                            <CompoundTooltip compoundKey="cbd">
                              <span className="cursor-help pb-0.5 border-b border-dashed border-[var(--border-subtle)] hover:border-emerald-500">CBD</span>
                            </CompoundTooltip>:{" "}
                            <strong className="text-emerald-600 dark:text-emerald-300 font-bold">
                              {strain.cannabinoids.cbd.replace(/% - /g, "-")}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[var(--text-secondary)] font-sans font-medium line-clamp-2 mt-2 leading-relaxed">
                        {strain.description}
                      </p>

                      {/* Interactive Terpene Gauge */}
                      {strain.terpenes.length > 0 && (
                        <div className="mt-3.5 space-y-1.5 p-2 bg-[var(--bg-main)]/60 rounded-lg border border-[var(--border-subtle)]">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
                              Major:{" "}
                              {
                                strain.terpenes.reduce((prev, current) =>
                                  prev.percentage > current.percentage
                                    ? prev
                                    : current,
                                ).name
                              }
                            </span>
                            <span className="text-[9px] font-mono font-bold text-[var(--text-muted)]">
                              {(
                                strain.terpenes.reduce((prev, current) =>
                                  prev.percentage > current.percentage
                                    ? prev
                                    : current,
                                ).percentage * 100
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                          <div className="h-1.5 bg-[var(--bg-surface-elevated)] rounded-full border border-[var(--border-subtle)] overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min((strain.terpenes.reduce((prev, current) => (prev.percentage > current.percentage ? prev : current)).percentage / 0.8) * 100, 100)}%`,
                              }}
                              transition={{ duration: 1, ease: "circOut" }}
                              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-3 gap-2">
                        <div className="flex flex-wrap gap-1">
                          {strain.benefits.slice(0, 1).map((b) => (
                            <span
                              key={b}
                              className="bg-emerald-500/5 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] text-emerald-600 dark:text-emerald-300 font-black font-mono rounded"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleCompareToggle(e, strain)}
                          className={`px-2 py-0.5 text-[8.5px] font-mono rounded border transition-all shrink-0 cursor-pointer ${
                            comparedStrains.some((x) => x.id === strain.id)
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40 font-bold"
                              : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-emerald-500/30"
                          }`}
                        >
                          {comparedStrains.some((x) => x.id === strain.id)
                            ? "Added"
                            : "+ Compare"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="text-center py-10 border border-dashed border-[var(--border-subtle)] rounded-xl space-y-2">
                <Compass className="w-8 h-8 text-[var(--text-muted)] mx-auto animate-pulse" />
                <p className="text-xs text-[var(--text-muted)] font-sans">
                  No matching cultivars found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: High Fidelity Chemical/Botanical Lab Sheet */}
        <div className="lg:col-span-8 p-5 md:p-8 bg-[var(--bg-main)]/30 border border-[var(--border-regular)] rounded-2xl overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStrain.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-4 border-b border-[var(--border-subtle)]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-[#b87333] uppercase tracking-widest block font-bold">
                    Active Chemical Blueprint
                  </span>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-500 dark:text-[#b87333]" />
                    {selectedStrain.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3.5 mt-1">
                    <p className="text-xs text-[var(--text-secondary)] font-mono font-medium italic">
                      Parentage: {selectedStrain.parentage.join(" × ")}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => handleCompareToggle(e, selectedStrain)}
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded border cursor-pointer transition-all ${
                        comparedStrains.some((x) => x.id === selectedStrain.id)
                          ? "bg-emerald-600 text-white dark:bg-emerald-950/20 border-emerald-500 dark:border-emerald-400 dark:text-emerald-300 font-extrabold"
                          : "bg-emerald-200 text-emerald-950 dark:bg-emerald-500/15 dark:text-white border-emerald-400 dark:border-emerald-500/40 hover:bg-emerald-300 dark:hover:bg-emerald-500/30"
                      }`}
                    >
                      {comparedStrains.some((x) => x.id === selectedStrain.id)
                        ? "Added"
                        : "+ Compare"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(selectedStrain.id)}
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded border cursor-pointer transition-all flex items-center gap-1 ${
                        favorites.includes(selectedStrain.id)
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold"
                          : "bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-[var(--bg-main)]"
                      }`}
                    >
                      <Star
                        className={`w-3 h-3 ${favorites.includes(selectedStrain.id) ? "fill-amber-500 text-amber-500" : "text-[var(--text-muted)]"}`}
                      />
                      {favorites.includes(selectedStrain.id)
                        ? "FAVORITE"
                        : "Add Favorite"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="p-3 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-center min-w-[70px]">
                    <span className="text-[8px] font-mono text-[var(--text-secondary)] block font-bold uppercase">
                      <CompoundTooltip compoundKey="thc">
                        <span className="cursor-help pb-[1px] border-b border-dashed border-[var(--border-subtle)] hover:border-rose-500">THC</span>
                      </CompoundTooltip>
                    </span>
                    <span className="text-lg font-mono font-bold text-rose-500">
                      {selectedStrain.cannabinoids.thc}
                    </span>
                  </div>
                  <div className="p-3 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl text-center min-w-[70px]">
                    <span className="text-[8px] font-mono text-[var(--text-secondary)] block font-bold uppercase">
                      <CompoundTooltip compoundKey="cbd">
                        <span className="cursor-help pb-[1px] border-b border-dashed border-[var(--border-subtle)] hover:border-emerald-500">CBD</span>
                      </CompoundTooltip>
                    </span>
                    <span className="text-lg font-mono font-bold text-emerald-500">
                      {selectedStrain.cannabinoids.cbd}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left side column: detailed story list & medical items */}
                <div className="md:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block font-extrabold">
                      Botanical Monograph
                    </span>
                    <p className="text-xs md:text-sm text-[var(--text-primary)] font-sans leading-relaxed font-normal">
                      {selectedStrain.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block font-extrabold">
                      Heritage Story
                    </span>
                    <p className="text-[11px] md:text-xs text-[var(--text-secondary)] font-sans leading-normal font-medium">
                      {selectedStrain.heritageStory}
                    </p>
                  </div>

                  {/* Flavor profiling */}
                  <div className="space-y-2 bg-[var(--bg-surface-elevated)] p-4 rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-widest block font-extrabold">
                      Aromatic & Flavor Indicators:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {selectedStrain.flavors.map((f) => (
                        <span
                          key={f}
                          className="bg-emerald-200/60 dark:bg-emerald-500/10 border border-emerald-400/40 dark:border-emerald-500/30 px-2.5 py-1 text-[9px] font-mono font-bold text-emerald-950 dark:text-white rounded"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side column: active terpene gauges and cultivation */}
                <div className="md:col-span-5 space-y-6">
                  {/* Microscopic Terpenes Breakdown */}
                  <div
                    id="terpenes-breakdown"
                    className="space-y-3.5 p-4 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center pb-1 border-b border-[var(--border-subtle)]">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-black block">
                          Primary Terpoids
                        </span>
                      </div>
                      <Award className="w-3.5 h-3.5 text-emerald-500" />
                    </div>

                    <div className="space-y-4 font-sans text-xs">
                      {selectedStrain.terpenes.map((terp) => {
                        const normalizedWidth = Math.min(
                          (terp.percentage / 0.8) * 100,
                          100,
                        );
                        return (
                          <div
                            id={`terpene-row-${terp.name.toLowerCase()}`}
                            key={`${selectedStrain.id}-${terp.name.toLowerCase()}`}
                            onClick={() => {
                              const key = terp.name
                                .toLowerCase()
                                .replace("beta-", "")
                                .replace("alpha-", "")
                                .trim();
                              const dbItem = TERPENES_DATABASE[key] || {
                                name: terp.name,
                                chemicalClass: "Active Terpene Complex",
                                boilingPoint: "N/A",
                                botanicalSources: ["Various plants and herbs"],
                                effects: [terp.effect],
                                scientificMechanism:
                                  "Operates synergistically to produce the 'entourage effect' with adjacent cannabinoids.",
                                aromaNotes: terp.aroma,
                              };
                              setSelectedTerpeneDetails(dbItem);
                            }}
                            className="space-y-1 cursor-pointer group/terp p-1 rounded-lg transition-all text-left"
                          >
                            <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                              <span className="flex items-center gap-1.5">
                                <CompoundTooltip compoundKey={terp.name}>
                                  <strong className="text-[var(--text-primary)] font-semibold group-hover/terp:text-emerald-500 transition-colors border-b border-dashed border-[var(--border-subtle)] hover:border-emerald-500">
                                    {terp.name}
                                  </strong>
                                </CompoundTooltip>
                                <Info className="w-2.5 h-2.5 text-emerald-500/50" />
                              </span>
                              <span className="font-mono text-[9px] md:text-[10px] text-emerald-600 dark:text-[#b87333] font-bold">
                                {(terp.percentage * 100).toFixed(2)}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-[var(--bg-main)] rounded-full overflow-hidden relative border border-slate-300 dark:border-[var(--border-subtle)]">
                              <motion.div
                                className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400 rounded-full absolute top-0 left-0"
                                initial={{ width: 0 }}
                                animate={{ width: `${normalizedWidth}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-[var(--text-secondary)] italic font-semibold">
                              <span>Aroma: {terp.aroma}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cultivation metrics */}
                  <div className="p-4 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl space-y-3">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block font-bold">
                      Cultivation Metrics
                    </span>

                    <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                      <div className="space-y-0.5">
                        <span className="text-[var(--text-secondary)] block font-bold uppercase">
                          DIFFICULTY
                        </span>
                        <strong className="text-[var(--text-primary)] flex items-center gap-1">
                          <Shield
                            className={`w-3 h-3 ${selectedStrain.cultivation.difficulty === "Easy" ? "text-emerald-500" : "text-yellow-600"}`}
                          />
                          {selectedStrain.cultivation.difficulty}
                        </strong>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[var(--text-secondary)] block font-bold uppercase">
                          FLOWERING
                        </span>
                        <strong className="text-[var(--text-primary)] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-500" />
                          {selectedStrain.cultivation.floweringTime}
                        </strong>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[var(--text-secondary)] block font-bold uppercase">
                          CLIMATE
                        </span>
                        <strong className="text-[var(--text-primary)] flex items-center gap-1">
                          <Sun className="w-3 h-3 text-[#b87333]" />
                          {selectedStrain.cultivation.preferredClimate}
                        </strong>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[var(--text-secondary)] block font-bold uppercase">
                          YIELD
                        </span>
                        <strong className="text-[var(--text-primary)] flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-blue-500" />
                          {selectedStrain.cultivation.yield}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic log */}
              <div className="p-4 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl space-y-3 font-sans mt-6">
                <div className="flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-600 dark:text-[#b87333] uppercase">
                    Academic Log
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-[11px] md:text-xs font-bold text-[var(--text-primary)] leading-tight">
                    "{selectedStrain.scientificStudy.title}"
                  </h5>
                  <div className="flex gap-2 text-[10px] text-[var(--text-secondary)] font-mono font-bold uppercase">
                    <span>{selectedStrain.scientificStudy.journal}</span>
                    <span>•</span>
                    <span>{selectedStrain.scientificStudy.year}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed">
                    {selectedStrain.scientificStudy.findings}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Lab Comparison Sticky Drawer Bar */}
      {comparedStrains.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#040806]/95 border border-white/10 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-40 max-w-lg w-[calc(100%-2rem)] backdrop-blur-md justify-between"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="space-y-0.5 text-left leading-tight">
              <span className="text-[10px] font-mono text-gray-400 block uppercase tracking-wider">
                Clinical Lab Suite ({comparedStrains.length}/2 Strains selected)
              </span>
              <span className="text-xs text-white font-medium block truncate max-w-[220px]">
                {comparedStrains[0].name}
                {comparedStrains[1]
                  ? ` × ${comparedStrains[1].name}`
                  : " vs ...select another"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setComparedStrains([])}
              className="text-[10px] font-mono text-gray-500 hover:text-white underline uppercase cursor-pointer"
            >
              Clear
            </button>
            <button
              disabled={comparedStrains.length < 2}
              onClick={() => setIsCompareOpen(true)}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest font-bold rounded-lg cursor-pointer transition-all ${
                comparedStrains.length === 2
                  ? "bg-[#b87333] hover:bg-[#c68242] text-black shadow-lg shadow-[#b87333]/10"
                  : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
              }`}
            >
              {comparedStrains.length === 2
                ? "Analyze Side-by-Side"
                : "Need 2 Strains"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Side-by-Side Compare Modal Overlay */}
      {isCompareOpen && comparedStrains.length === 2 && (
        <CompareModal
          strainA={comparedStrains[0]}
          strainB={comparedStrains[1]}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      {/* Terpene Botanical Monograph Modal */}
      <AnimatePresence>
        {selectedTerpeneDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#040806]/95 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedTerpeneDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#070e0b] border border-emerald-500/20 rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] p-6 relative overflow-hidden text-left"
            >
              {/* Decorative accent background grids */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#b87333]/5 rounded-full blur-2xl pointer-events-none" />

              <button
                onClick={() => setSelectedTerpeneDetails(null)}
                className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors text-white cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className="w-5 h-5 text-emerald-450" />
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-extrabold text-glow">
                  Botanical Terpenoid Monograph
                </span>
              </div>

              <div className="space-y-4">
                {/* Title and primary specs */}
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-white flex items-baseline gap-2">
                    {selectedTerpeneDetails.name}
                    <span className="text-xs font-mono text-[#b87333] font-normal">
                      ({selectedTerpeneDetails.chemicalClass})
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mt-2 text-[10px] font-mono">
                    <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                      <span className="text-gray-400 block uppercase text-[8px] font-bold">
                        Boiling Point
                      </span>
                      <strong className="text-[#b87333] text-xs font-bold block mt-0.5">
                        {selectedTerpeneDetails.boilingPoint}
                      </strong>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                      <span className="text-gray-400 block uppercase text-[8px] font-bold">
                        Aroma Profile
                      </span>
                      <strong className="text-white text-xs font-bold block truncate mt-0.5">
                        {selectedTerpeneDetails.aromaNotes}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Key therapeutic effects */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-mono text-emerald-400 uppercase font-black tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Key Clinical/Physiological Effects
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTerpeneDetails.effects.map((fx: string) => (
                      <span
                        key={fx}
                        className="bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded text-[10px] text-gray-250 font-medium"
                      >
                        {fx}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chemical / Biological mechanism */}
                <div className="space-y-1 text-xs text-left">
                  <h4 className="text-[11px] font-mono text-[#b87333] uppercase font-black tracking-wider text-left">
                    Biological Mechanism
                  </h4>
                  <p className="text-gray-300 leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-white/5 italic">
                    "{selectedTerpeneDetails.scientificMechanism}"
                  </p>
                </div>

                {/* Botanical sources */}
                <div className="space-y-1">
                  <h4 className="text-[11px] font-mono text-emerald-400 uppercase font-black tracking-wider">
                    Natural Occurrences Outside Cannabis
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTerpeneDetails.botanicalSources.map(
                      (source: string) => (
                        <span
                          key={source}
                          className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-[6px] text-[10px] text-emerald-300 font-mono font-medium"
                        >
                          {source}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between gap-2.5">
                  <span className="text-[9px] font-mono text-gray-500 self-center">
                    PEER-REVIEWED MONOGRAPH DATA
                  </span>
                  <button
                    onClick={() => setSelectedTerpeneDetails(null)}
                    className="px-4 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-mono text-[10px] font-black uppercase rounded-lg transition-all border border-emerald-500/30 hover:border-transparent cursor-pointer animate-pulse"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
