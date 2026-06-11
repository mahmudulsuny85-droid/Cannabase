export interface CompoundGlossaryItem {
  id: string;
  name: string;
  type: "Cannabinoid" | "Terpene";
  description: string;
  effects: string[];
  medicalBenefits: string[];
}

export const COMPOUND_GLOSSARY: Record<string, CompoundGlossaryItem> = {
  // Cannabinoids
  THC: {
    id: "thc",
    name: "THC (Tetrahydrocannabinol)",
    type: "Cannabinoid",
    description: "The principal psychoactive constituent of cannabis. It binds directly to CB1 receptors in the central nervous system.",
    effects: ["Euphoria", "Relaxation", "Altered perception", "Increased appetite"],
    medicalBenefits: ["Pain relief", "Anti-nausea", "Sleep aid", "Muscle relaxant"]
  },
  CBD: {
    id: "cbd",
    name: "CBD (Cannabidiol)",
    type: "Cannabinoid",
    description: "A major non-intoxicating compound. Acts as a modulator for other cannabinoids and offers widespread therapeutic properties.",
    effects: ["Clear-headed", "Calm", "Relaxing without intoxication"],
    medicalBenefits: ["Anti-inflammatory", "Anti-anxiety", "Seizure reduction", "Neuroprotective"]
  },
  CBG: {
    id: "cbg",
    name: "CBG (Cannabigerol)",
    type: "Cannabinoid",
    description: "Known as the 'mother cannabinoid'. Non-psychoactive and typically found in low trace amounts in mature plants.",
    effects: ["Mental clarity", "Energy"],
    medicalBenefits: ["Antibacterial", "Anti-inflammatory", "Appetite stimulation", "Glaucoma relief"]
  },
  CBN: {
    id: "cbn",
    name: "CBN (Cannabinol)",
    type: "Cannabinoid",
    description: "Created when THC degrades over time. Known heavily for its sedating properties.",
    effects: ["Heavy sedation", "Sleepiness"],
    medicalBenefits: ["Insomnia relief", "Pain relief", "Anti-convulsant"]
  },
  
  // Terpenes
  Myrcene: {
    id: "myrcene",
    name: "Myrcene",
    type: "Terpene",
    description: "The most abundant terpene in cannabis. Dictates whether a strain will have an 'Indica' like sedating effect depending on concentration.",
    effects: ["Sedation", "Couch-lock", "Relaxation"],
    medicalBenefits: ["Muscle tension relief", "Sleep aid", "Anti-inflammatory"]
  },
  Limonene: {
    id: "limonene",
    name: "Limonene",
    type: "Terpene",
    description: "A bright, citrusy terpene also found in fruit rinds. Highly associated with elevated mood and stress relief.",
    effects: ["Uplifting", "Euphoria", "Energetic"],
    medicalBenefits: ["Anxiety relief", "Anti-depressant", "Gastric reflex relief"]
  },
  Linalool: {
    id: "linalool",
    name: "Linalool",
    type: "Terpene",
    description: "A floral terpene commonly found in lavender. Famous for its calming, anxiety-reducing properties.",
    effects: ["Calm", "Relaxed", "Mood improvement"],
    medicalBenefits: ["Anti-anxiety", "Anticonvulsant", "Anti-depressant"]
  },
  Pinene: {
    id: "pinene",
    name: "Pinene",
    type: "Terpene",
    description: "The most common terpene in the natural world. Scents of pine needles and acts as a bronchodilator.",
    effects: ["Alertness", "Memory retention", "Clear-headed"],
    medicalBenefits: ["Asthma relief", "Anti-inflammatory", "Anti-ulcer"]
  },
  Caryophyllene: {
    id: "caryophyllene",
    name: "Caryophyllene",
    type: "Terpene",
    description: "A spicy, peppery terpene that is unique because it also acts as a dietary cannabinoid, binding directly to CB2 receptors.",
    effects: ["Stress relief", "Relaxation without sedation"],
    medicalBenefits: ["Pain relief", "Anti-inflammatory", "Gastrointestinal protection"]
  }
};
