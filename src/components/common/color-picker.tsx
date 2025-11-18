import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  className?: string;
}

export default function ColorPicker({
  colors,
  selectedColor,
  onColorSelect,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
            selectedColor === color ? "border-foreground" : "border-transparent"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        >
          {selectedColor === color && (
            <Check className="h-4 w-4 text-white mx-auto" />
          )}
        </button>
      ))}
    </div>
  );
}
