import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import FormHeader from "@/components/common/form-header";
import ImageUploadSection from "@/components/common/image-upload-section";
import { useAppStore } from "@/stores/app-store";
import EmptyData from "@/components/common/empty-data";
import { Link, useNavigate } from "react-router-dom";
import StudentDetailsForm from "@/components/forms/student-details-form";
import StudentParentsForm from "@/components/forms/student-parents-form";
import RegisterUserForm from "@/components/forms/register-user-form";
import type { Student } from "@/types/student";
import type { RegisterResponse } from "@/types/auth";
import { toast } from "sonner";

export default function CreateStudent() {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const { ownerHasSchool } = useAppStore();
  const [studentProfileImg, setStudentProfileImg] = useState<string | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [createdUserId, setCreatedUserId] = useState<number | undefined>(
    undefined
  );

  const steps = [
    {
      id: 1,
      title: t("addStudent.steps.registerInfo"),
      description: t("addStudent.steps.registerInfoDesc"),
      icon: User,
    },
    {
      id: 2,
      title: t("addStudent.steps.personalInfo"),
      description: t("addStudent.steps.personalInfoDesc"),
      icon: UserCheck,
    },
    {
      id: 3,
      title: t("addStudent.steps.parentsInfo"),
      description: t("addStudent.steps.parentsInfoDesc"),
      icon: Users,
    },
  ];

  const handleLogoChange = (url: string | null) => {
    setStudentProfileImg(url);
  };

  const handleStep1Complete = (userData: Student | RegisterResponse) => {
    setStudentData(userData as Student);
    setCreatedUserId((userData as Student).id);
    setCurrentStep(2);
  };

  const handleStep2Complete = (personalData: Student) => {
    setStudentData({ ...studentData, ...personalData });
    setCurrentStep(3);
  };

  const handleStep3Complete = (parentsData: Student) => {
    if (parentsData) {
      toast.success(t("addStudent.success"));
      navigate("/admin/students");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegisterUserForm
            redirectPath="/admin/students"
            profileImage={studentProfileImg}
            registerForRole="STUDENT"
            onSuccess={handleStep1Complete}
            showRedirect={false}
          />
        );
      case 2:
        return (
          <StudentDetailsForm
            studentId={createdUserId}
            initialData={studentData}
            onSuccess={handleStep2Complete}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <StudentParentsForm
            studentId={createdUserId}
            onSuccess={handleStep3Complete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const isStepCompleted = (stepId: number) => {
    if (stepId === 1) return !!createdUserId;
    if (stepId === 2) return currentStep > 2;
    return false;
  };

  if (!ownerHasSchool) {
    return (
      <EmptyData
        title={t("addStudent.noSchoolTitle")}
        desc={t("addStudent.noSchoolDesc")}
        actions={
          <Link to={"/admin/schools/create"}>
            <Button>{t("addStudent.noSchoolBtn")}</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <FormHeader
        title={t("addStudent.create")}
        desc={t("addStudent.createDesc")}
      />

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress bar */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 -z-10">
            <div
              className="h-1 bg-primary transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = isStepCompleted(step.id);
            const StepIcon = step.icon;

            return (
              <div
                key={step.id || index}
                className="flex flex-col items-center relative"
              >
                {/* Step circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <div className="w-4 h-4 bg-primary-foreground rounded-full" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>

                {/* Step label */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium ${
                      isActive || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-xs">
                    {step.description}
                  </div>
                </div>

                {/* Step number */}
                <div
                  className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                    isActive || isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Image Upload - Only show in first step */}
        {currentStep === 1 && (
          <ImageUploadSection
            uploadType="profile-image"
            title={t("addStudent.imgSectionTitle")}
            desc={t("addStudent.imgSectionDesc")}
            onImageChange={handleLogoChange}
          />
        )}

        {/* Form Section */}
        <div className={currentStep === 1 ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = steps[currentStep - 1]?.icon;
                  return Icon ? <Icon className="w-5 h-5" /> : null;
                })()}
                {steps[currentStep - 1]?.title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep - 1]?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getStepContent()}

              {/* Navigation Buttons - Only show for steps that don't have their own buttons */}
              {currentStep === 1 && (
                <div className="flex justify-between mt-6 pt-6 border-t">
                  <div>{/* Empty space for alignment */}</div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      type="submit"
                      form="register-user-form" // This should match your form id
                    >
                      {t("common.continue")}
                      {dir === "rtl" ? (
                        <ChevronLeft className="w-4 h-4 ml-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
