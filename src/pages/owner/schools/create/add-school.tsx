import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, School } from "lucide-react";
import { toast } from "sonner";
import { useCreateSchool } from "@/hooks/use-schools";
import { ImageUpload } from "@/components/common/image-upload";
import {
  CreateSchoolForm,
  type CreateSchoolFormData,
} from "@/components/forms/create-school-form";

export default function AddSchool() {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const createSchoolMutation = useCreateSchool();
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);

  const handleSubmit = async (data: CreateSchoolFormData) => {
    try {
      // Combine form data with the uploaded logo
      const schoolData = {
        ...data,
        image: schoolLogo || data.image, // Use uploaded logo if available
      };

      await createSchoolMutation.mutateAsync(schoolData);

      toast.success(
        t("school.createSuccess") || "School created successfully!"
      );

      // Redirect to schools list after successful creation
      navigate("/owner/dashboard");
    } catch (error) {
      console.error("Failed to create school:", error);
      toast.error(
        t("school.createError") || "Failed to create school. Please try again."
      );
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLogoChange = (url: string | null) => {
    setSchoolLogo(url);
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
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
          <h1 className="text-3xl font-bold tracking-tight">
            {t("school.create") || "Create School"}
          </h1>
          <p className="text-muted-foreground">
            {t("school.createDescription") ||
              "Add a new school to your account"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Upload Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                {t("school.logo") || "School Logo"}
              </CardTitle>
              <CardDescription>
                {t("school.logoDescription") || "Upload your school's logo"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImageChange={handleLogoChange}
                uploadType="school-logo"
                className="justify-center"
              />
            </CardContent>
          </Card>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("school.details") || "School Details"}</CardTitle>
              <CardDescription>
                {t("school.detailsDescription") ||
                  "Enter the basic information for your school"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateSchoolForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={createSchoolMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Tips Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {t("school.tips") || "Tips for creating a school"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul
            className={`space-y-2 text-sm text-muted-foreground ${
              dir === "rtl" ? "list-disc pr-4" : "list-disc pl-4"
            }`}
          >
            <li>
              {t("school.tipCode") ||
                "School code should be unique and easy to remember"}
            </li>
            <li>
              {t("school.tipName") || "Use the official name of your school"}
            </li>
            <li>
              {t("school.tipContact") ||
                "Provide accurate contact information for communication"}
            </li>
            <li>
              {t("school.tipLogo") ||
                "A high-quality logo helps with brand recognition"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
