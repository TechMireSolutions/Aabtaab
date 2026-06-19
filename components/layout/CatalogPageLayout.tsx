import PageHeader from "@/components/layout/PageHeader";

interface CatalogPageLayoutProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  emptyMessage: string;
  isEmpty: boolean;
  children: React.ReactNode;
}

export default function CatalogPageLayout({
  eyebrow,
  title,
  subtitle,
  emptyMessage,
  isEmpty,
  children,
}: CatalogPageLayoutProps) {
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="section-muted min-h-catalog">
        <div className="container-page">
          {isEmpty ? (
            <p className="empty-state">{emptyMessage}</p>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
