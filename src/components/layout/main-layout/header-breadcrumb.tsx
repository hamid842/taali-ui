import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";

export default function HeaderBreadcrumb() {
  const location = useLocation();
  const { t } = useLanguage();

  // Split current path and remove empty or unwanted segments (like "admin")
  const segments = location.pathname.split("/").filter(Boolean);
  const filtered = segments.filter((s) => s !== "admin");

  // Get the last segment for display
  const lastSegment = filtered[filtered.length - 1] || "dashboard";

  const translateSegment = (segment: string) => {
    const key = `breadcrumbs.${segment}`;
    const translation = t(key);
    return translation === key ? decodeURIComponent(segment) : translation;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin/dashboard">{t("breadcrumbs.home")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="breadcrumb-separator" />

        <BreadcrumbItem>
          <span className="font-semibold capitalize">
            {translateSegment(lastSegment)}
          </span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
