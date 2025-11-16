import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormHeader from "@/components/common/form-header";
import ImageUploadSection from "@/components/common/image-upload-section";
import RegisterUserForm from "@/components/forms/register-user-form";
import { useAppStore } from "@/stores/app-store";
import NoSchoolContent from "@/components/dashboard/schools/no-school-content";

export default function AddSchoolAdmin() {
  const { dir, t } = useLanguage();
  const { ownerHasSchool } = useAppStore();
  const [adminProfileImg, setAdminProfileImg] = useState<string | null>(null);

  const handleLogoChange = (url: string | null) => {
    setAdminProfileImg(url);
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {ownerHasSchool ? (
        <>
          {/* Header */}
          <FormHeader
            title={t("owner.addSchoolAdmin.create")}
            desc={t("owner.addSchoolAdmin.createDesc")}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo Upload Section */}
            <ImageUploadSection
              uploadType="profile-image"
              title={t("owner.addSchoolAdmin.imgSectionTitle")}
              desc={t("owner.addSchoolAdmin.imgSectionDesc")}
              onImageChange={handleLogoChange}
            />

            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("owner.addSchoolAdmin.details")}</CardTitle>
                  <CardDescription>
                    {t("owner.addSchoolAdmin.detailsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterUserForm
                    registerForRole="SCHOOL_MANAGER"
                    redirectPath="/owner/users"
                    profileImage={adminProfileImg}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Tips Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("owner.addSchoolAdmin.tips")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul
                className={`space-y-2 text-sm text-muted-foreground ${
                  dir === "rtl" ? "list-disc pr-4" : "list-disc pl-4"
                }`}
              >
                <li>{t("owner.addSchoolAdmin.tipCode")}</li>
                <li>{t("owner.addSchoolAdmin.tipName")}</li>
                <li>{t("owner.addSchoolAdmin.tipContact")}</li>
                <li>{t("owner.addSchoolAdmin.tipLogo")}</li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <NoSchoolContent />
      )}
    </div>
  );
}
