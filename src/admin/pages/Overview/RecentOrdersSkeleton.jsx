import Skeleton from "../../components/common/Skelton/Skeleton";

export default function RecentOrdersSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-[#F0F1F5] last:border-0">
          {Array.from({ length: 5 }).map((_, colIndex) => (
            <td key={colIndex} className="px-5 py-5">
              <Skeleton
                className={`h-3 ${colIndex === 1 ? "w-24" : "w-16"} max-w-full`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
