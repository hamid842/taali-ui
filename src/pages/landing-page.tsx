import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  Smartphone,
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "react-i18next";
import dashboardImg from "@/assets/images/dashboard.png";
import dashFaImage from "@/assets/images/dashboard-fa.png";

interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

interface Features {
  [key: string]: FeatureItem[];
}

export default function LandingPage() {
  const isRTL = useAppStore((state) => state.isRTL);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const featureList = features[currentLanguage.code];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div
          className={`flex flex-col md:flex-row items-center gap-12 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Text Content - This will automatically swap sides */}
          <div className="flex-1 space-y-6">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              {t("landingPage.hero.badge")}
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t("landingPage.hero.title")}
              <span className="text-primary block">
                {t("landingPage.hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              {t("landingPage.hero.description")}
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 pt-4 ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <Button size="lg" className="text-lg px-8">
                {t("landingPage.hero.ctaPrimary")}
                <ArrowRight
                  className={`h-4 w-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
                />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                {t("landingPage.hero.ctaSecondary")}
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-8 text-sm text-muted-foreground">
              <div>{t("landingPage.hero.features").split("•")[0]}</div>
              <div>•</div>
              <div>{t("landingPage.hero.features").split("•")[1]}</div>
            </div>
          </div>

          {/* Image - This will automatically swap sides */}
          <div className="flex-1">
            <div className="bg-muted/50 rounded-2xl p-8 border shadow-lg">
              <img
                src={isRTL ? dashFaImage : dashboardImg}
                alt={t("landingPage.dashboard.title")}
                className="rounded-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("landingPage.features.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("landingPage.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, index: number) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="flex items-center gap-2">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              500+
            </div>
            <div className="text-muted-foreground">
              {t("landingPage.stats.schools")}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              50K+
            </div>
            <div className="text-muted-foreground">
              {t("landingPage.stats.students")}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              10K+
            </div>
            <div className="text-muted-foreground">
              {t("landingPage.stats.teachers")}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              99.9%
            </div>
            <div className="text-muted-foreground">
              {t("landingPage.stats.uptime")}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("landingPage.cta.title")}
            </h2>
            <p className="text-lg opacity-90">
              {t("landingPage.cta.description")}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center pt-6 ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <Button size="lg" variant="secondary" className="text-lg px-8">
                {t("landingPage.cta.primary")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent border-white text-white"
              >
                {t("landingPage.cta.secondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-lg font-semibold">
              {t("landingPage.footer.brand")}
            </div>
            <div
              className={`flex gap-6 mt-4 md:mt-0 text-sm text-muted-foreground ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div>{t("landingPage.footer.privacy")}</div>
              <div>{t("landingPage.footer.terms")}</div>
              <div>{t("landingPage.footer.support")}</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features: Features = {
  en: [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Student Management",
      description:
        "Complete student profiles, attendance tracking, and academic records in one secure platform.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Academic Planning",
      description:
        "Curriculum management, lesson planning, and gradebook integration for seamless academic operations.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Analytics & Reports",
      description:
        "Real-time insights and comprehensive reports to drive data-informed decisions.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security with full compliance for educational data protection.",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: "Mobile Ready",
      description:
        "Access all features on any device with our responsive web and mobile applications.",
    },
  ],
  fa: [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "مدیریت دانش آموزان",
      description:
        "پروفایل های کامل دانش آموزی، ردیابی حضور و غیاب و سوابق تحصیلی در یک پلتفرم امن.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "برنامه ریزی تحصیلی",
      description:
        "مدیریت برنامه درسی، برنامه ریزی درسی و یکپارچه سازی دفتر نمره برای عملیات تحصیلی بی نقص.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "تحلیل و گزارشات",
      description:
        "بینش های لحظه ای و گزارشات جامع برای اتخاذ تصمیمات مبتنی بر داده.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "امن و مطابق",
      description:
        "امنیت در سطح سازمانی با رعایت کامل الزامات حفاظت از داده های آموزشی.",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: "آماده موبایل",
      description:
        "دسترسی به تمام ویژگی ها در هر دستگاهی با برنامه های وب و موبایل پاسخگو ما.",
    },
  ],
};
