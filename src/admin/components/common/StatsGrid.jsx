export default function StatsGrid({ children, columns = 4 }) {
  const columnClasses = {
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 xl:grid-cols-4",
  };

  return (
    <section
      className={`grid ${
        columnClasses[columns] || columnClasses[4]
      } gap-2.5 sm:gap-4`}
    >
      {children}
    </section>
  );
}
