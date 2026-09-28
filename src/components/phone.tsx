import Image from "next/image";

type PhoneProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
  /** Replaces the plain Dynamic Island, e.g. with a live activity. */
  island?: React.ReactNode;
};

// A plain device frame around a real screenshot. The screen is an image,
// never a UI mocked up out of divs.
export function Phone({
  src,
  alt,
  className = "",
  sizes = "280px",
  preload = false,
  island,
}: PhoneProps) {
  return (
    <div
      className={`relative aspect-[390/844] rounded-[44px] bg-bezel p-[7px] shadow-[0_30px_60px_-20px_rgb(29_29_31/0.35)] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[37px] bg-surface-2">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
        {island ?? (
          <div className="absolute left-1/2 top-2.5 h-[22px] w-[30%] -translate-x-1/2 rounded-full bg-bezel" />
        )}
      </div>
    </div>
  );
}
