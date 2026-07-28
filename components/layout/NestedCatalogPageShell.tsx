import type { ReactNode } from "react";
import NestedBreadcrumbs from "@/components/content/NestedBreadcrumbs";
import NestedChildrenGrid, {
  type NestedChildCard,
} from "@/components/content/NestedChildrenGrid";
import type {
  NestedCatalogBase,
  NestedCatalogPageContext,
} from "@/lib/catalog/nested-page";

interface NestedCatalogPageShellProps {
  base: NestedCatalogBase;
  title: string;
  excerpt?: string | null;
  context: NestedCatalogPageContext;
  childCards: NestedChildCard[];
  jsonLd?: ReactNode;
  children: ReactNode;
}

/** Shared chrome for course/service catch-alls: breadcrumbs + children grid vs leaf. */
export default function NestedCatalogPageShell({
  base,
  title,
  excerpt,
  context,
  childCards,
  jsonLd,
  children,
}: NestedCatalogPageShellProps) {
  const { hasChildren, ancestry, currentPath, breadcrumbItems } = context;

  return (
    <div>
      {!hasChildren && jsonLd}
      <NestedBreadcrumbs
        base={base.segment}
        baseLabel={base.label}
        ancestry={ancestry}
        currentTitle={title}
        currentPath={currentPath}
        breadcrumbItems={breadcrumbItems}
      />

      {hasChildren ? (
        <NestedChildrenGrid
          eyebrow={base.eyebrow}
          title={title}
          excerpt={excerpt ?? undefined}
          currentPath={currentPath}
          items={childCards}
        />
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
