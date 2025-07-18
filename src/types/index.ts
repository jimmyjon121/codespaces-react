export interface User {
  uid: string;
  email?: string;
  displayName?: string;
}

export interface UserData {
  role: 'Clinical Coach' | 'Admin 1' | 'Admin 2' | 'Admin 3';
  name: string;
  email: string;
  permissions: string[];
  createdAt: Date;
  lastLogin: Date;
}

export interface Program {
  id: string;
  name: string;
  type: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  capacity?: number;
  ageRange?: string;
  genderServed?: string;
  programLength?: string;
  cost?: string;
  insurance?: string[];
  specializations?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientPlan {
  id: string;
  clientName: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  programs: ShortlistedProgram[];
  referent: Referent;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShortlistedProgram {
  program: Program;
  status: 'Vetting' | 'Presented to Family' | 'Application Submitted' | 'Confirmed' | 'Declined' | 'Waitlisted';
  notes: string;
  addedAt: Date;
}

export interface Referent {
  name: string;
  type: 'Educational Consultant' | 'Therapist' | 'Psychiatrist' | 'Probation Officer' | 'Family Friend' | 'Other';
  role: 'Leading Aftercare' | 'Handling Options' | 'Both' | 'Observing';
  contact: {
    email: string;
    phone: string;
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface ThemeConfig {
  color: string;
  darkMode: boolean;
}

export interface AppSettings {
  theme: ThemeConfig;
  notifications: boolean;
  autoSave: boolean;
  mapDefaultZoom: number;
  itemsPerPage: number;
}

export interface AnalyticsData {
  totalPrograms: number;
  activeClients: number;
  completedPlacements: number;
  averageTimeToPlacement: number;
  programsByType: Record<string, number>;
  placementsByMonth: Array<{
    month: string;
    placements: number;
  }>;
}

export interface MapSearchOptions {
  center: [number, number];
  radius: number; // in miles
  programTypes?: string[];
  specializations?: string[];
}

export interface ViewProps {
  userData: UserData;
  isDemoMode: boolean;
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  activeClientPlan?: ClientPlan | null;
  setActiveClientPlan: (plan: ClientPlan | null) => void;
}
