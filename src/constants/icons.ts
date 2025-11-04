import {
  AudioWaveform,
  Calendar,
  Command,
  GalleryVerticalEnd,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";

// Icon mapping for your menu items
const iconMap = {
  home: Home,
  inbox: Inbox,
  calendar: Calendar,
  search: Search,
  settings: Settings,
  building: GalleryVerticalEnd,
  users: AudioWaveform,
  command: Command,
  "dollar-sign": Command,
  "user-check": AudioWaveform,
  "graduation-cap": AudioWaveform,
  "family-restroom": AudioWaveform,
  "event-available": Calendar,
  assignment: Inbox,
  "book-open": Inbox,
  "clipboard-check": Inbox,
  "file-text": Inbox,
  "user-plus": AudioWaveform,
  "bar-chart": Settings,
  "credit-card": Inbox,
  "trending-down": Settings,
  utensils: Inbox,
  "shopping-cart": Inbox,
  package: Inbox,
  plus: Inbox,
  list: Inbox,
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
