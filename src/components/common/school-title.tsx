import type { ElementType } from "react";
import SchoolImage from "../layout/main-layout/school-switcher/school-image";
import { School } from "lucide-react";
import type { ISchool } from "@/types/school";
import { useSidebar } from "../ui/sidebar";

type SchoolTitleProps = {
  school: ISchool | null;
};

export default function SchoolTitle({ school }: SchoolTitleProps) {
  const { state } = useSidebar();
  // Get logo component (you can enhance this to use actual images)
  const getLogoComponent = (): ElementType => {
    // If you have school images, you can use them here
    // For now, we'll use a building icon as default
    return School;
  };

  const SchoolLogo = getLogoComponent();
  return (
    <div className="flex w-full items-center justify-between gap-4 px-2">
      <div className="flex items-center gap-3">
        <div className="flex size-6 items-center justify-center rounded-md border">
          {school?.image ? (
            <SchoolImage school={school} />
          ) : (
            <SchoolLogo className="size-3.5 shrink-0" />
          )}
        </div>
        {state === "expanded" && (
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{school?.name}</span>
            <span className="text-xs text-muted-foreground">
              {school?.code}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
