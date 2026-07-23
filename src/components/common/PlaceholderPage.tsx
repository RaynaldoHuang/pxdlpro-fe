import type { LucideIcon } from "lucide-react";

import { ContentWrapper } from "@/components/common/ContentWrapper";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function PlaceholderPage({
  title,
  description,
  icon,
}: PlaceholderPageProps) {
  return (
    <ContentWrapper>
      <PageHeader title={title} description={description} />
      <EmptyState
        title={`${title} Placeholder`}
        description="This page is ready for future CMS functionality."
        icon={icon}
      />
    </ContentWrapper>
  );
}
