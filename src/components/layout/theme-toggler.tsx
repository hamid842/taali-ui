import { useTheme } from "@/hooks/use-theme";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <Button size={"icon"} variant={"outline"} onClick={toggleTheme}>
      {theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
