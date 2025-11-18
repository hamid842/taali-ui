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
            title={t("manager.addTeacher.create")}
            desc={t("manager.addTeacher.createDesc")}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo Upload Section */}
            <ImageUploadSection
              uploadType="profile-image"
              title={t("manager.addTeacher.imgSectionTitle")}
              desc={t("manager.addTeacher.imgSectionDesc")}
              onImageChange={handleLogoChange}
            />

            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("manager.addTeacher.details")}</CardTitle>
                  <CardDescription>
                    {t("manager.addTeacher.detailsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterUserForm
                    redirectPath="/manager/teachers"
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
              <CardTitle className="text-lg">
                {t("manager.addTeacher.tips")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul
                className={`space-y-2 text-sm text-muted-foreground ${
                  dir === "rtl" ? "list-disc pr-4" : "list-disc pl-4"
                }`}
              >
                <li>{t("manager.addTeacher.tipSpecialization")}</li>
                <li>{t("manager.addTeacher.tipQualification")}</li>
                <li>{t("manager.addTeacher.tipContact")}</li>
                <li>{t("manager.addTeacher.tipProfile")}</li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <EmptyData
          title={t("manager.addTeacher.noSchoolTitle")}
          desc={t("manager.addTeacher.noSchoolDesc")}
          actions={
            <Link to={"/manager/schools/create"}>
              <Button>{t("manager.addTeacher.noSchoolBtn")}</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
