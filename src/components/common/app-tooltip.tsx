import { type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

export interface AppTooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
}

export function AppTooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}: AppTooltipProps) {
  const { dir } = useLanguage();

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          dir={dir}
          className={cn(
            "px-3 py-2 text-sm rounded-md shadow-md bg-popover text-popover-foreground dark:bg-neutral-900",
            className
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
