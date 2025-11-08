import { ImageDisplay } from "@/components/common/image-display";
import type { ISchool } from "@/types/school";

export default function SchoolImage({ school }: { school: ISchool | null }) {
  return (
    <div className="p-4 border rounded-lg">
      <ImageDisplay
        imageUrl={school?.image}
        alt={`${school?.name} logo`}
        size="xs"
      />
    </div>
  );
}
