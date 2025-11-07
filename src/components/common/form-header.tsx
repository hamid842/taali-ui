import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";

type FormHeaderProps = {
  title: string;
  desc: string;
};

export default function FormHeader({ title, desc }: FormHeaderProps) {
  const { dir } = useLanguage();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button
        variant="outline"
        size="icon"
        onClick={handleCancel}
        className={dir === "rtl" ? "rotate-180" : ""}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
