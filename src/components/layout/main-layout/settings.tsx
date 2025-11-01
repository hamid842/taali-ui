import { MonitorCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useLanguage } from "@/hooks/use-language";

export default function Settings() {
  const { dir } = useLanguage();
  return (
    <Drawer direction={dir === "rtl" ? "left" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <MonitorCog />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div>Settings here</div>
      </DrawerContent>
    </Drawer>
  );
}
