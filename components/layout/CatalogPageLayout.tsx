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
      <div className="py-8 sm:py-12 bg-slate-50/40 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isEmpty ? (
            <p className="text-center text-gray-400 text-[15px] py-24">
              {emptyMessage}
            </p>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
