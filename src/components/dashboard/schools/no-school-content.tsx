import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { AlertTriangle, School } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NoSchoolContent() {
    const { t } = useLanguage();
    const navigate = useNavigate()
    
    const handleCreateSchool = () => {
      navigate("/owner/schools/create");
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("owner.users.title")}
            </h1>
            <p className="text-muted-foreground">{t("owner.users.subtitleAdmins")}</p>
          </div>
        </div>

        {/* Warning Card */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-600 mb-2">
                  {t("owner.users.noSchoolWarningTitle")}
                </h3>
                <p className="text-yellow-700 mb-4">
                  {t("owner.users.noSchoolWarningDesc")}
                </p>
                <Button
                  onClick={handleCreateSchool}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <School className="w-4 h-4 mr-2" />
                  {t("owner.users.createSchoolButton")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}