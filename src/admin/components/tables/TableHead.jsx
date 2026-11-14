export default function TableHead({ columns = [] }) {
  return (
    <thead>
      <tr className="border-b border-[#F0F1F5] bg-[#FAFAFC] text-xs font-semibold text-[#777D8A]">
        {columns.map((column) => (
          <th
            key={column.label}
            className={`px-5 py-4 ${
              column.align === "center" ? "text-center" : "text-right"
            }`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
