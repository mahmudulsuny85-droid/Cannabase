export interface CannabinoidProfile {
  thc: string; // e.g., "5-8%"
  cbd: string; // e.g., "10-15%"
  cbg?: string; // e.g., "1-2%"
}

export interface TerpeneProfile {
  name: string;
  percentage: number;
  effect: string;
  aroma: string;
}

export interface CultivationInfo {
  difficulty: "Easy" | "Moderate" | "Experienced";
  floweringTime: string; // e.g., "8-9 weeks"
  preferredClimate: string; // e.g., "Mild, Temperate"
  yield: string; // e.g., "High"
}

export interface Strain {
  id: string;
  name: string;
  type: "Sativa" | "Indica" | "Hybrid" | "Sativa-Dominant" | "Indica-Dominant";
  thcValue: number; // numeric value for charts e.g. 5
  cbdValue: number; // numeric value for charts e.g. 15
  parentage: string[];
  cannabinoids: CannabinoidProfile;
  terpenes: TerpeneProfile[];
  benefits: string[];
  flavors: string[];
  description: string;
  scientificStudy: {
    title: string;
    journal: string;
    year: number;
    findings: string;
    link: string;
  };
  cultivation: CultivationInfo;
  heritageStory: string;
}

export interface UserProfile {
  handle: string;
  badge: string;
  bio: string;
  associatesCount: number;
  stashCount: number;
  sharedBlends: {
    id: string;
    name: string;
    thc: number;
    cbd: number;
    terpeneName: string;
  }[];
}

export interface DirectMessage {
  id: string;
  sender: string;
  receiver: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  userHandle: string;
  lastMessage: string;
  lastTimestamp: string;
  isOnline: boolean;
  unreadCount: number;
}
