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
import { useAppStore } from "@/stores/app-store";
import EmptyData from "@/components/common/empty-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RegisterUserForm from "@/components/forms/register-user-form";

export default function CreateTeacher() {
  const { dir, t } = useLanguage();
  const { ownerHasSchool } = useAppStore();
  const [teacherProfileImg, setTeacherProfileImg] = useState<string | null>(
    null
  );

  const handleLogoChange = (url: string | null) => {
    setTeacherProfileImg(url);
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {ownerHasSchool ? (
        <>
          {/* Header */}
          <FormHeader
            title={t("admin.addTeacher.create")}
            desc={t("admin.addTeacher.createDesc")}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo Upload Section */}
            <ImageUploadSection
              uploadType="profile-image"
              title={t("admin.addTeacher.imgSectionTitle")}
              desc={t("admin.addTeacher.imgSectionDesc")}
              onImageChange={handleLogoChange}
            />

            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.addTeacher.details")}</CardTitle>
                  <CardDescription>
                    {t("admin.addTeacher.detailsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterUserForm
                    redirectPath="/admin/teachers"
                    profileImage={teacherProfileImg}
                    registerForRole={"TEACHER"}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Tips Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">{t("admin.addTeacher.tips")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul
                className={`space-y-2 text-sm text-muted-foreground ${
                  dir === "rtl" ? "list-disc pr-4" : "list-disc pl-4"
                }`}
              >
                <li>{t("admin.addTeacher.tipSpecialization")}</li>
                <li>{t("admin.addTeacher.tipQualification")}</li>
                <li>{t("admin.addTeacher.tipContact")}</li>
                <li>{t("admin.addTeacher.tipProfile")}</li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <EmptyData
          title={t("admin.addTeacher.noSchoolTitle")}
          desc={t("admin.addTeacher.noSchoolDesc")}
          actions={
            <Link to={"/admin/schools/create"}>
              <Button>{t("admin.addTeacher.noSchoolBtn")}</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
