import type { CourseDetail } from "@/types/course";

interface CoursePricingSectionProps {
  heading?: string;
  tables?: CourseDetail["pricingTables"];
}

export default function CoursePricingSection({
  heading = "Affordable Plans",
  tables = [],
}: CoursePricingSectionProps) {
  if (!tables || tables.length === 0) return null;

  return (
    <section className="section-y bg-white">
      <div className="container-narrow">
        <div className="mb-12 text-center">
          <p className="text-eyebrow mb-2">Plans</p>
          <h2 className="heading-section-lg">{heading}</h2>
        </div>
        <div className="space-y-10">
          {tables.map((pricingTable, tableIndex) => (
            <div key={tableIndex}>
              {pricingTable.label && (
                <h3 className="mb-4 flex items-center gap-2 text-sm-plus font-bold text-slate-700">
                  <span className="eyebrow-line" />
                  {pricingTable.label}
                </h3>
              )}
              {(pricingTable.rows?.length ?? 0) > 0 && (
                <div className="table-shell">
                  <table className="w-full border-collapse text-sm-plus">
                    <thead>
                      <tr className="bg-slate-800 text-white">
                        <th className="rounded-tl-2xl px-5 py-4 text-left font-semibold">
                          Study Plan
                        </th>
                        <th className="px-5 py-4 text-left font-semibold">
                          Weekly Frequency
                        </th>
                        <th className="px-5 py-4 text-left font-semibold">
                          Monthly Classes
                        </th>
                        <th className="px-5 py-4 text-left font-semibold">
                          Fee Per Class
                        </th>
                        <th className="rounded-tr-2xl px-5 py-4 text-left font-semibold">
                          Monthly Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(pricingTable.rows ?? []).map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={`border-t border-gray-100 ${rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                        >
                          <td className="px-5 py-3.5 font-semibold text-slate-900">
                            {row.plan}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {row.weeklyFrequency}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {row.monthlyClasses}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {row.feePerClass}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-brand-700">
                            {row.monthlyTotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
