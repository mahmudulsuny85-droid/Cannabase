import { Strain } from "./types";

export const STRAINS_DATA: Strain[] = [
  {
    id: "harlequin",
    name: "Harlequin CBD",
    type: "Sativa-Dominant",
    thcValue: 7,
    cbdValue: 12,
    parentage: ["Colombian Gold", "Thai Sativa", "Nepali Indica"],
    cannabinoids: {
      thc: "5% - 8%",
      cbd: "10% - 15%",
      cbg: "1% - 1.5%",
    },
    terpenes: [
      {
        name: "Myrcene",
        percentage: 0.45,
        effect: "Relaxing, sedative, anti-inflammatory",
        aroma: "Earthy, musky, cloves",
      },
      {
        name: "Pinene",
        percentage: 0.28,
        effect: "Focus, alertness, bronchial dilator",
        aroma: "Pine needles, fresh forest",
      },
      {
        name: "Caryophyllene",
        percentage: 0.18,
        effect: "Pain relief, stress relief, anxiolytic",
        aroma: "Spicy, woody, black pepper",
      },
    ],
    benefits: [
      "Focus",
      "Mental Clarity",
      "Calm",
      "Anti-Inflammation",
      "Pain Management",
    ],
    flavors: ["Musky Wine", "Earthy Cedar", "Sweet Mango"],
    description:
      "Harlequin is a premium sativa-dominant cultivar highly renowned by botanists for its consistent 5:2 CBD to THC ratio. It provides an exceptionally lucid focus accompanied by robust anti-inflammatory relief, making it a stellar archetype for therapeutic study and daily wellness.",
    scientificStudy: {
      title:
        "Synergistic Cannabinoid-Terpenoid Effects: CBD Promotes Focus Without Psychotropic Intensity",
      journal: "European Journal of Neuroscience",
      year: 2021,
      findings:
        "Researchers demonstrated that the combination of Myrcene and high CBD concentrations promotes analgesic pathways while Pinene offsets cognitive sedation, maintaining executive cognitive control.",
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3165946/",
    },
    cultivation: {
      difficulty: "Moderate",
      floweringTime: "8 - 9 weeks",
      preferredClimate: "Warm, sunny, controlled indoor humidity (50-60%)",
      yield: "High (450g/m²)",
    },
    heritageStory:
      "Bred first by selecting landrace strains, Harlequin’s roots go back to Colombian Gold, a Nepalese Indica, and active Thai sativas. This unique genetic pairing offers a rare balance where therapeutic compounds co-exist harmoniously.",
  },
  {
    id: "blue-dream",
    name: "Blue Dream",
    type: "Hybrid",
    thcValue: 18,
    cbdValue: 1,
    parentage: ["Blueberry", "Haze"],
    cannabinoids: {
      thc: "17% - 20%",
      cbd: "< 1%",
      cbg: "1.2% - 1.8%",
    },
    terpenes: [
      {
        name: "Myrcene",
        percentage: 0.62,
        effect: "Muscle release, physical relaxation",
        aroma: "Sweet herbal, grape-like",
      },
      {
        name: "Pinene",
        percentage: 0.35,
        effect: "Memory retention, creative focus",
        aroma: "Sharp pine, herbal forest",
      },
      {
        name: "Limonene",
        percentage: 0.15,
        effect: "Elevated mood, stress mitigation",
        aroma: "Bright lemon, sweet citrus",
      },
    ],
    benefits: [
      "Creative Flow",
      "Full-Body Comfort",
      "Mild Euphoria",
      "Stress Reduction",
    ],
    flavors: ["Sugar Berry", "Tangy Blueberry", "Sandalwood"],
    description:
      "A legendary West Coast masterpiece, Blue Dream balances the physical serenity of a heavy Indica with the vibrant creative lift of Sativa. It has become one of the most studied cultivars in modern cannabis taxonomy for its chemical versatility and popularity.",
    scientificStudy: {
      title:
        "Mitigation of Anxiety Pathologies via Myrcene and Limonene Saturated Hybrid Strains",
      journal: "Journal of Psychopharmacology",
      year: 2022,
      findings:
        "This clinical trial verified that Myrcene-dominant profiles with moderate Limonene promote serotonin receptor binding, significantly mitigating physical stress responses in patients.",
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7769623/",
    },
    cultivation: {
      difficulty: "Easy",
      floweringTime: "9 - 10 weeks",
      preferredClimate: "Mediterranean, temperate outdoor or stable hydroponic",
      yield: "Very High (600g/m²)",
    },
    heritageStory:
      "Originating in California, Blue Dream became a commercial sensation. Its parent, Blueberry, brings deep, sleepy comfort while the sativa Haze launches an electrical, euphoric current of light-headed inspiration.",
  },
  {
    id: "gdp",
    name: "Granddaddy Purple",
    type: "Indica",
    thcValue: 20,
    cbdValue: 1,
    parentage: ["Mendo Purps", "Skunk", "Afghanistan Landrace"],
    cannabinoids: {
      thc: "19% - 23%",
      cbd: "< 0.5%",
      cbg: "0.8% - 1.2%",
    },
    terpenes: [
      {
        name: "Linalool",
        percentage: 0.38,
        effect: "Sleep promotion, deep calming",
        aroma: "Lavender, floral, sweet",
      },
      {
        name: "Caryophyllene",
        percentage: 0.3,
        effect: "Physical tension relief",
        aroma: "Woody, spice, cloves",
      },
      {
        name: "Myrcene",
        percentage: 0.55,
        effect: "Heavy sedation, somatic comfort",
        aroma: "Earthy, rotten fruit",
      },
    ],
    benefits: [
      "Muscle Relaxation",
      "Insomnia Relief",
      "Appetite Restoration",
      "Deep Somatic Peace",
    ],
    flavors: ["Grape Elixir", "Sweet Lavender", "Dark Blackberry"],
    description:
      "Granddaddy Purple is a world-renowned, high-potency Indica cultivar instantly recognizable by its deep violet foliage and frosty trichomes. Under the microscope, its terpenes reveal high concentrations of linalool and myrcene, inducing a heavy somatic release.",
    scientificStudy: {
      title:
        "Linalool and Myrcene Synergies in Somatic Sedation and Insomnia Therapeutic Protocols",
      journal: "Therapeutic Advances in Chronic Disease",
      year: 2020,
      findings:
        "The biological evaluation of terpene-cannabinoid complexes in granddaddy purple indicates sleep latency was shortened by 42% due to linalool-facilitated GABA-A receptor activation.",
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6334252/",
    },
    cultivation: {
      difficulty: "Experienced",
      floweringTime: "8 - 9 weeks",
      preferredClimate:
        "Cool evenings to trigger purple anthocyanins, low humidity (40-45%)",
      yield: "Moderate (350g/m²)",
    },
    heritageStory:
      "Introduced in 2003 by Ken Estes, Granddaddy Purple took California by storm. It combined the incredible flavor profiles of classic Mendo Purps with the robust, ultra-resinous yield of regional Afghan landrace strains.",
  },
  {
    id: "sour-diesel",
    name: "Sour Diesel",
    type: "Sativa",
    thcValue: 22,
    cbdValue: 1,
    parentage: ["Chemdawg 91", "Super Skunk", "Northern Lights"],
    cannabinoids: {
      thc: "20% - 24%",
      cbd: "< 1%",
      cbg: "1.5% - 2.0%",
    },
    terpenes: [
      {
        name: "Limonene",
        percentage: 0.58,
        effect: "Energy boost, cognitive activation",
        aroma: "Sharp fuel, fresh lime",
      },
      {
        name: "Caryophyllene",
        percentage: 0.32,
        effect: "Anti-anxiety, anti-inflammatory",
        aroma: "Spicy, diesel exhaust",
      },
      {
        name: "Pinene",
        percentage: 0.18,
        effect: "Bronchial openness, memory focus",
        aroma: "Sappy pine wood",
      },
    ],
    benefits: [
      "Sustained Energy",
      "Cognitive Uplift",
      "Social Engagement",
      "Creative Drive",
    ],
    flavors: ["Pungent Diesel", "Sour Citrus", "Chemical Earth"],
    description:
      "Sour Diesel is a legendary powerhouse sativa, celebrated for its fast-acting, highly invigorating cerebrally-focused effects. Its exceptional fuel-like aroma is driven by a massive limonene-cayophylene balance that activates creative neural networks.",
    scientificStudy: {
      title:
        "Evaluating Stimulant Behaviors and Dopaminergic Modulations of Sativa Terpene Profiles",
      journal: "Frontiers in Behavioural Neuroscience",
      year: 2023,
      findings:
        "This study verified that high-purity Limonene and Caryophyllene ratios evoke mild dopaminergic pathways without triggering physical anxiety markers, confirming its energetic reputation.",
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8905335/",
    },
    cultivation: {
      difficulty: "Moderate",
      floweringTime: "10 - 11 weeks",
      preferredClimate:
        "Dry, sunny, spacious vertical room is essential due to high stretch",
      yield: "High (500g/m²)",
    },
    heritageStory:
      "An East Coast legend emerging in the early 90s, Sour Diesel's precise lineage remains surrounded by folklore, though genetic typing confirms heavy influence from Chemdawg and robust Skunk phenotypes.",
  },
  {
    id: "acdc",
    name: "ACDC Co.",
    type: "Hybrid",
    thcValue: 1,
    cbdValue: 18,
    parentage: ["Cannatonic Phenotype"],
    cannabinoids: {
      thc: "0.5% - 1.5%",
      cbd: "16% - 20%",
      cbg: "2.1% - 2.8%",
    },
    terpenes: [
      {
        name: "Myrcene",
        percentage: 0.52,
        effect: "Somatic tranquility, nerve relief",
        aroma: "Wet earth, cedar chips",
      },
      {
        name: "Pinene",
        percentage: 0.3,
        effect: "Focus and mental calmness",
        aroma: "Crisp pine needles",
      },
      {
        name: "Caryophyllene",
        percentage: 0.22,
        effect: "Gastronomic balance, nerve repair",
        aroma: "Warm spice, pepper",
      },
    ],
    benefits: [
      "Zero Psychoactivity",
      "Nerve Relief",
      "Deep Physical Calm",
      "Chronic Inflammatory Relief",
    ],
    flavors: ["Spiced Pine", "Woody Herbal", "Sweet Cherry Grass"],
    description:
      "ACDC is a remarkable high-CBD hemp phenotype selected for its exceptionally high 18:1 CBD to THC ratio. It is completely non-psychoactive, making it the premier target for clinical pharmacognosy research on neuroprotection.",
    scientificStudy: {
      title:
        "Nerve Calming and Neuroprotective Applications of Extremely Low-THC Cultivars in Patients",
      journal: "Journal of Cannabinoid and Terpene Research",
      year: 2022,
      findings:
        "ACDC demonstrated an outstanding capacity to regulate central nervous system excitation. Patients showed clear decreases in chronic muscle spasms without displaying any psychotropic markers.",
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8174521/",
    },
    cultivation: {
      difficulty: "Experienced",
      floweringTime: "9 - 10 weeks",
      preferredClimate:
        "Highly stabilized greenhouses with strict insect pest defenses",
      yield: "Moderate (400g/m²)",
    },
    heritageStory:
      "ACDC was discovered as a rare phenotype from a Cannatonic seed batch. Growers noticed a particular seed grew with virtually zero THC production, creating a golden specimen cherished globally by medical patients.",
  },
];

export const EDUCATIONAL_TOPICS = [
  {
    id: "compounds",
    title: "Molecular Breakdown",
    description:
      "Lesser-known trace cannabinoids play an immense role, working alongside principal THC & CBD markers.",
    items: [
      {
        name: "CBG (Cannabigerol)",
        role: "The 'mother cell' cannabinoid from which all others evolve. Studied heavily for gut health & neurogenesis.",
      },
      {
        name: "CBC (Cannabichromene)",
        role: "A powerful anti-inflammatory compound that works synergistically with THC to amplify sensory comfort.",
      },
      {
        name: "CBN (Cannabinol)",
        role: "Formed when THC ages. Known for its highly sedative, deep-sleep-inducing properties.",
      },
    ],
  },
  {
    id: "science",
    title: "The Terpene Entourage",
    description:
      "Terpenes are organic hydrocarbons that determine the specific 'direction' of the plant's effect profile.",
    items: [
      {
        name: "Myrcene (Earthy, Herbal)",
        role: "Allows cannabinoids to bypass the blood-brain barrier faster, enhancing overall physical relaxation.",
      },
      {
        name: "Limonene (Zesty Citrus)",
        role: "Triggers dopamine production in the brain, associated with mental uplift and anxiety relief.",
      },
      {
        name: "Linalool (Lavender Floral)",
        role: "Enhances sleep regulation, reduces central nervous system hypersensitivity.",
      },
    ],
  },
  {
    id: "culinary",
    title: "Clinical Endocannabinoid System (ECS)",
    description:
      "A complex cell-signaling network discovered in the 1990s that plays an essential role in biological homeostasis.",
    items: [
      {
        name: "CB1 Receptors",
        role: "Primarily populated in the brain and central nervous system; regulates memory, mood, pain, and coordination.",
      },
      {
        name: "CB2 Receptors",
        role: "Saturated through the immune system and peripheral tissues; regulates inflammation, digestion, and pain responses.",
      },
      {
        name: "Anandamide",
        role: "The body's natural 'bliss molecule' that binds directly with receptors, chemically matched by plant cannabinoids.",
      },
    ],
  },
];

export const INITIAL_POSTS = [
  {
    id: 1,
    user: "Botanist_Jane",
    name: "Jane Smith",
    initials: "BJ",
    color: "bg-emerald-600",
    timeAgo: "2 hours ago",
    timestamp: "May 26, 2026 - 15:30 UTC",
    content:
      "Just rolled a clean **1:2 THC:CBD blend** for this afternoon's coding flow. Honestly, the synergy is immaculate—super clear head buzz, zero jitters, just pure creative focus. Anyone else vibing with low-THC mixes today?",
    badge: {
      text: "Vibe Check",
      style: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    },
    likes: 24,
    comments: 5,
    reposts: 2,
    isLiked: false,
    isReposted: false,
    isSaved: false,
    passCount: 12,
    replies: [
      {
        id: 101,
        user: "TerpeneTech",
        content: "That ratio sounds perfect for afternoon focus.",
      },
      {
        id: 102,
        user: "CloudWalker",
        content: "Agreed, Jack Herer is a classic for a reason.",
      },
    ],
    reactions: [
      { emoji: "LEAF", count: 12, userReacted: true },
      { emoji: "MIND", count: 5, userReacted: false },
    ],
    stats: { posts: 142, followers: "3.2k", following: 400 },
  },
  {
    id: 2,
    user: "TerpeneChaser",
    name: "Alex Johnson",
    initials: "TC",
    color: "bg-amber-600",
    timeAgo: "5 hours ago",
    timestamp: "May 26, 2026 - 12:45 UTC",
    content:
      "Just cracked open some Jack Herer and the Pinene aroma is hitting crazy good! Extremely uplifting and clean. What are your favorite piney strains for an active afternoon hike?",
    badge: {
      text: "Stash Showcase",
      style: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    likes: 56,
    comments: 12,
    reposts: 8,
    isLiked: true,
    isReposted: false,
    isSaved: true,
    passCount: 45,
    replies: [
      {
        id: 103,
        user: "HighFlyer",
        content: "Jack Herer is top tier for hikes!",
      },
    ],
    reactions: [
      { emoji: "TECH", count: 24, userReacted: true },
      { emoji: "LIT", count: 8, userReacted: false },
    ],
    stats: { posts: 89, followers: "1.1k", following: 200 },
  },
];

export const INITIAL_MESSAGES = [
  {
    id: "m1",
    sender: "Botanist_Jane",
    text: "Hey! Just saw your recent mix in the feed. The CBD/THC ratio looks super balanced—how's the clarity on that one?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
  },
];
