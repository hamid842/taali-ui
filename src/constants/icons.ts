import {
  AudioWaveform,
  Building,
  Calendar,
  ChartBar,
  ChartColumnBig,
  Command,
  Contact,
  DollarSign,
  FileText,
  FileUser,
  GraduationCap,
  Grid2X2,
  Grid2X2Plus,
  Home,
  Inbox,
  LayoutDashboard,
  List,
  ListPlus,
  ReceiptText,
  School,
  Search,
  Settings,
  UserPlus,
  UserRoundPlus,
  Users,
  UsersRound,
} from "lucide-react";

// Icon mapping for your menu items
const iconMap = {
  "layout-dashboard": LayoutDashboard,
  contact: Contact,
  inbox: Inbox,
  calendar: Calendar,
  search: Search,
  settings: Settings,
  building: Building,
  school: School,
  users: Users,
  command: Command,
  "file-user": FileUser,
  "file-text": FileText,
  "grid-2x2": Grid2X2,
  "grid-2x2-plus": Grid2X2Plus,
  "users-round": UsersRound,
  "dollar-sign": DollarSign,
  "user-check": AudioWaveform,
  "graduation-cap": GraduationCap,
  "family-restroom": AudioWaveform,
  "event-available": Calendar,
  "chart-column-big": ChartColumnBig,
  assignment: Inbox,
  "book-open": Inbox,
  "clipboard-check": Inbox,
  "user-plus": UserPlus,
  "user-round-plus": UserRoundPlus,
  "chart-bar": ChartBar,
  "credit-card": ReceiptText,
  "trending-down": Settings,
  utensils: Inbox,
  "shopping-cart": Inbox,
  package: Inbox,
  plus: ListPlus,
  list: List,
  bell: Inbox,
  book: Inbox,
  award: Inbox,
};

// Fallback icon if the icon name is not found
const FallbackIcon = Home;

// Get icon component from string
export function getIconComponent(iconName?: string) {
  if (!iconName) return FallbackIcon;

  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent || FallbackIcon;
}
