import type { CourseDetail } from "@/types/course";

interface CoursePricingSectionProps {
  heading?: string;
  tables?: CourseDetail["pricingTables"];
}

export default function CoursePricingSection({
  heading = "Affordable Plans",
  tables = [],
}: CoursePricingSectionProps) {
  if (tables.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-2">
            Plans
          </p>
          <h2 className="font-bold text-[24px] sm:text-[32px] text-slate-900 tracking-[-0.02em]">
            {heading}
          </h2>
        </div>
        <div className="space-y-10">
          {tables.map((pricingTable, tableIndex) => (
            <div key={tableIndex}>
              {pricingTable.label && (
                <h3 className="font-bold text-[14.5px] text-slate-700 mb-4 flex items-center gap-2">
                  <span className="w-5 h-px bg-cyan-400 inline-block" />
                  {pricingTable.label}
                </h3>
              )}
              {(pricingTable.rows?.length ?? 0) > 0 && (
                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                  <table className="w-full text-[13.5px] border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-white">
                        <th className="text-left font-semibold px-5 py-4 rounded-tl-2xl">
                          Study Plan
                        </th>
                        <th className="text-left font-semibold px-5 py-4">
                          Weekly Frequency
                        </th>
                        <th className="text-left font-semibold px-5 py-4">
                          Monthly Classes
                        </th>
                        <th className="text-left font-semibold px-5 py-4">
                          Fee Per Class
                        </th>
                        <th className="text-left font-semibold px-5 py-4 rounded-tr-2xl">
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
                          <td className="px-5 py-3.5 font-semibold text-cyan-700">
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
