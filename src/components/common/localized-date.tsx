import { useMemo } from "react";

interface LocalizedDateProps {
  locale: string; // e.g. "en" or "fa"
}

export default function LocalizedDate({ locale }: LocalizedDateProps) {
  const today = useMemo(() => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat(
      locale === "fa" ? "fa-IR" : "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
    return formatter.format(date);
  }, [locale]);

  return <span className="text-sm text-muted-foreground">{today}</span>;
}
