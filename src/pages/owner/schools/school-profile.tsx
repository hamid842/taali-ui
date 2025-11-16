import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, Users, Building, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useSchool, useUpdateSchool } from "@/hooks/use-schools";
import FormHeader from "@/components/common/form-header";
import ImageUploadSection from "@/components/common/image-upload-section";
import {
  SchoolProfileForm,
  type SchoolProfileFormData,
} from "@/components/forms/school-profile-form";

export default function SchoolProfile() {
  const { schoolId } = useParams();
  const { t, dir } = useLanguage();
  const { data: school, isLoading } = useSchool(schoolId!);
  const updateSchoolMutation = useUpdateSchool();
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);

  const handleSubmit = async (data: Partial<SchoolProfileFormData>) => {
    try {
      const updateData = {
        ...data,
        image: schoolLogo || data.image,
      };

      await updateSchoolMutation.mutateAsync({
        id: schoolId!,
        data: updateData,
      });

      toast.success(
        t("school.profile.updateSuccess") ||
          "School profile updated successfully!"
      );
    } catch (error) {
      console.error("Failed to update school profile:", error);
      toast.error(
        t("school.profile.updateError") || "Failed to update school profile."
      );
    }
  };

  const handleLogoChange = (url: string | null) => {
    setSchoolLogo(url);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!school) {
    return <div>School not found</div>;
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <FormHeader
        title={t("school.profile.title")}
        desc={t("school.profile.description")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Logo Upload Section */}
        <div className="lg:col-span-1">
          <ImageUploadSection
            uploadType="school-logo"
            icon={<School className="h-5 w-5" />}
            title={t("school.profile.logo")}
            desc={t("school.profile.logoDescription")}
            currentImage={`${import.meta.env.VITE_API_BASE_URL}/${
              school.image
            }`}
            onImageChange={handleLogoChange}
          />
        </div>

        {/* Main Form Section */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="basic" className="space-y-6" dir={dir}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <School className="h-4 w-4" />
                {t("school.profile.tabs.basic")}
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t("school.profile.tabs.academic")}
              </TabsTrigger>
              <TabsTrigger
                value="facilities"
                className="flex items-center gap-2"
              >
                <Building className="h-4 w-4" />
                {t("school.profile.tabs.facilities")}
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                {t("school.profile.tabs.financial")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>{t("school.profile.tabs.basic")}</CardTitle>
                  <CardDescription>
                    {t("school.profile.tabs.basicDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SchoolProfileForm
                    school={school}
                    onSubmit={handleSubmit}
                    isLoading={updateSchoolMutation.isPending}
                    tab="basic"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic">
              <Card>
                <CardHeader>
                  <CardTitle>{t("school.profile.tabs.academic")}</CardTitle>
                  <CardDescription>
                    {t("school.profile.tabs.academicDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SchoolProfileForm
                    school={school}
                    onSubmit={handleSubmit}
                    isLoading={updateSchoolMutation.isPending}
                    tab="academic"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="facilities">
              <Card>
                <CardHeader>
                  <CardTitle>{t("school.profile.tabs.facilities")}</CardTitle>
                  <CardDescription>
                    {t("school.profile.tabs.facilitiesDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SchoolProfileForm
                    school={school}
                    onSubmit={handleSubmit}
                    isLoading={updateSchoolMutation.isPending}
                    tab="facilities"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle>{t("school.profile.tabs.financial")}</CardTitle>
                  <CardDescription>
                    {t("school.profile.tabs.financialDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SchoolProfileForm
                    school={school}
                    onSubmit={handleSubmit}
                    isLoading={updateSchoolMutation.isPending}
                    tab="financial"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
