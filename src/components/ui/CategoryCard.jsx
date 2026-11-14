import { ArrowLeft } from "lucide-react";

export default function CategoryCard({ title, href, image }) {
  return (
    <a
      className="group relative overflow-hidden rounded-md bg-blush"
      href={href}
    >
      <img
        alt={title}
        loading="lazy"
        width={768}
        height={960}
        className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        src={image}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/90 px-4 py-3">
        <span className="text-sm font-bold md:text-base">{title}</span>
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-1"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}
