import { Fragment } from "react/jsx-runtime";
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

  // Split current path and remove empty parts and 'admin'
  const segments = location.pathname.split("/").filter(Boolean);
  const filtered = segments.filter((s) => s !== "admin" && s !== "owner");

  // Helper: translate segment name
  const translateSegment = (segment: string) => {
    const key = `breadcrumbs.${segment}`;
    const translation = t(key);
    return translation === key ? decodeURIComponent(segment) : translation;
  };

  // Build breadcrumb items (excluding "admin")
  const paths = filtered.map((segment, index) => ({
    name: translateSegment(segment),
    path: `/${filtered.slice(0, index + 1).join("/")}`,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin/dashboard">{t("breadcrumbs.home")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Render dynamic segments */}
        {paths.map((item, index) => (
          <Fragment key={item.path}>
            <BreadcrumbSeparator className="breadcrumb-separator" />
            <BreadcrumbItem>
              {index < paths.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              ) : (
                <span className="font-semibold capitalize">{item.name}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
