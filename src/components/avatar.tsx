import Image from "next/image";
import { about, site } from "@/content";

type AvatarProps = {
  /** Rendered size in px. */
  size: number;
  className?: string;
  /** Leave empty where the name is already next to the photo. */
  alt?: string;
};

// Praveen's photo in a circle, or the Contacts-style monogram without one.
// Served as-is: the WebP is already cropped and sized.
export function Avatar({ size, className = "", alt = "" }: AvatarProps) {
  if (site.photo) {
    return (
      <Image
        src={site.photo}
        alt={alt}
        width={size}
        height={size}
        unoptimized
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#5ac8fa] to-[#0a5fd6] font-semibold tracking-tight text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {about.initials}
    </span>
  );
}
