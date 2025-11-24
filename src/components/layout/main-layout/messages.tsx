import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useMessageApi } from "@/hooks/use-message-api";
import { useNavigate } from "react-router-dom";

export default function MessagesIconWithBadge() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { useGetUnreadCount } = useMessageApi();

  const { data: unreadCountData } = useGetUnreadCount();

  const unreadCount = useMemo(() => {
    return unreadCountData?.data || 0;
  }, [unreadCountData]);

  const handleClick = () => {
    navigate("/messages");
  };

  const iconColor = theme === "dark" ? "#F1F5F9" : "#1E293B";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className="relative"
    >
      <MessageCircle size={24} color={iconColor} strokeWidth={1.5} />

      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full border-2 border-background"
        >
          <span className="text-xs font-bold leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </Badge>
      )}
    </Button>
  );
}
