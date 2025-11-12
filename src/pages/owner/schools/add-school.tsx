import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { School } from "lucide-react";
import { toast } from "sonner";
import { useCreateSchool } from "@/hooks/use-schools";
import {
  CreateSchoolForm,
  type CreateSchoolFormData,
} from "@/components/forms/create-school-form";
import FormHeader from "@/components/common/form-header";
import ImageUploadSection from "@/components/common/image-upload-section";
import { useAuth } from "@/hooks/use-auth";

export default function AddSchool() {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const createSchoolMutation = useCreateSchool();
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);

  const handleSubmit = async (data: CreateSchoolFormData) => {
    try {
      // Combine form data with the uploaded logo
      const schoolData = {
        ...data,
        ownerId:user?.id,
        image: schoolLogo || data.image, // Use uploaded logo if available
      };

      await createSchoolMutation.mutateAsync(schoolData);

      toast.success(
        t("addSchool.createSuccess") || "School created successfully!"
      );

      // Redirect to schools list after successful creation
      navigate("/owner/schools");
    } catch (error) {
      console.error("Failed to create school:", error);
      toast.error(
        t("addSchool.createError") ||
          "Failed to create school. Please try again."
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
      <FormHeader
        title={t("addSchool.create") || "Create School"}
        desc={
          t("addSchool.createDescription") || "Add a new school to your account"
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Upload Section */}
        <ImageUploadSection
          uploadType="school-logo"
          icon={<School className="h-5 w-5" />}
          title={t("addSchool.logo") || "School Logo"}
          desc={t("addSchool.logoDescription") || "Upload your school's logo"}
          onImageChange={handleLogoChange}
        />

        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("addSchool.details") || "School Details"}
              </CardTitle>
              <CardDescription>
                {t("addSchool.detailsDescription") ||
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
            {t("addSchool.tips") || "Tips for creating a school"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul
            className={`space-y-2 text-sm text-muted-foreground ${
              dir === "rtl" ? "list-disc pr-4" : "list-disc pl-4"
            }`}
          >
            <li>
              {t("addSchool.tipCode") ||
                "School code should be unique and easy to remember"}
            </li>
            <li>
              {t("addSchool.tipName") || "Use the official name of your school"}
            </li>
            <li>
              {t("addSchool.tipContact") ||
                "Provide accurate contact information for communication"}
            </li>
            <li>
              {t("addSchool.tipLogo") ||
                "A high-quality logo helps with brand recognition"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
