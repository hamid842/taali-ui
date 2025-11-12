import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ImageUpload } from "./image-upload";
import { Image } from "lucide-react";

type ImageUploadSectionProps = {
  icon?: ReactNode;
  title: string;
  desc: string;
  uploadType: "profile-image" | "school-logo";
  onImageChange: (url: string | null) => void;
};

export default function ImageUploadSection({
  icon,
  title,
  desc,
  uploadType,
  onImageChange,
}: ImageUploadSectionProps) {
  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon ? icon : <Image className="h-5 w-5" />}
            {title}
          </CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            onImageChange={onImageChange}
            uploadType={uploadType}
            className="justify-center"
          />
        </CardContent>
      </Card>
    </div>
  );
}
