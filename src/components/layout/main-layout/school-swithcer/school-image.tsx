import { ImageDisplay } from "@/components/common/image-display";
import type { School } from "@/types/school";

export default function SchoolImage({ school }: { school: School }) {
  return (
    <div className="p-4 border rounded-lg">
      <ImageDisplay
        imageUrl={school.image}
        alt={`${school.name} logo`}
        size="xs"
      />
    </div>
  );
}
