import Skeleton from "./Skeleton";

export default function TableSkeleton({ columns = 5, rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E9EBF0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-162.5 text-right">
          <thead>
            <tr className="border-b border-[#F0F1F5] bg-[#FAFAFC]">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-5 py-4">
                  <Skeleton className="h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F0F1F5]">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-5 py-5">
                    <Skeleton
                      className={`h-3 ${
                        colIndex === 0 ? "w-28" : "w-16"
                      } max-w-full`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
