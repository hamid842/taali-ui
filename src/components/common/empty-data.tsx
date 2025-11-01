import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderSearch } from "lucide-react";
import type { ReactNode } from "react";

type EmptyContentProps = {
  title: string;
  desc: string;
  actions: ReactNode;
};

export default function EmptyData({ title, desc, actions }: EmptyContentProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderSearch />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{desc}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{actions}</EmptyContent>
    </Empty>
  );
}
