import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

export default function Logout() {
  const { logout } = useAuth();
  return (
    <Button size={"icon"} variant="destructive" onClick={() => logout()}>
      <LogOut />
    </Button>
  );
}
