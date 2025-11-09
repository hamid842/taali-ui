import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Image } from "lucide-react";
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
import EmptyData from "@/components/common/empty-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
            title={t("addSchoolAdmin.create")}
            desc={t("addSchoolAdmin.createDesc")}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo Upload Section */}
            <ImageUploadSection
              icon={<Image className="h-5 w-5" />}
              uploadType="profile-image"
              title={t("addSchoolAdmin.imgSectionTitle")}
              desc={t("addSchoolAdmin.imgSectionDesc")}
              onImageChange={handleLogoChange}
            />

            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("addSchoolAdmin.details")}</CardTitle>
                  <CardDescription>
                    {t("addSchoolAdmin.detailsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterUserForm
                    registerForRole="ADMIN"
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
                {t("addSchoolAdmin.tips")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul
                className={`space-y-2 text-sm text-muted-foreground ${
                  dir === "rtl" ? "list-disc pr-4" : "list-disc pl-4"
                }`}
              >
                <li>{t("addSchoolAdmin.tipCode")}</li>
                <li>{t("addSchoolAdmin.tipName")}</li>
                <li>{t("addSchoolAdmin.tipContact")}</li>
                <li>{t("addSchoolAdmin.tipLogo")}</li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <EmptyData
          title={t("addSchoolAdmin.noSchoolTitle")}
          desc={t("addSchoolAdmin.noSchoolDesc")}
          actions={
            <Link to={"/admin/schools/create"}>
              <Button>{t("addSchoolAdmin.noSchoolBtn")}</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
