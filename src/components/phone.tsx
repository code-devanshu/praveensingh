import Image from "next/image";

type PhoneProps = {
  className?: string;
  sizes?: string;
  preload?: boolean;
  /**
   * "iphone" (default): rounded frame with a Dynamic Island. "android": a
   * generic flagship in the spirit of a Galaxy S Ultra (squarer corners,
   * titanium edge, punch-hole camera), with no brand on it.
   */
  device?: "iphone" | "android";
  /** Replaces the plain Dynamic Island, e.g. with a live activity. iPhone only. */
  island?: React.ReactNode;
} & (
  | { src: string; alt: string; wireframe?: never }
  | { wireframe: React.ReactNode; src?: never; alt?: never }
);

// A plain device frame around a real screenshot. The screen is an image,
// never a UI mocked up to pass as one. The only exception is `wireframe`:
// a deliberately abstract drawing (grey bars, no text or figures) for apps
// that can't be shown, labelled as an illustration wherever it's used.
export function Phone({
  src,
  alt,
  wireframe,
  device = "iphone",
  className = "",
  sizes = "280px",
  preload = false,
  island,
}: PhoneProps) {
  const screen = src ? (
    <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
  ) : (
    <div aria-hidden className="absolute inset-0">
      {wireframe}
    </div>
  );

  if (device === "android") {
    return (
      <div
        className={`relative aspect-[390/844] rounded-[26px] bg-linear-to-b from-[#8e8e93] via-[#5c5c61] to-[#3a3a3e] p-[2.5px] shadow-[0_30px_60px_-20px_rgb(29_29_31/0.35)] ${className}`}
      >
        {/* Power and volume keys on the right edge. */}
        <span aria-hidden className="absolute -right-[2px] top-[20%] h-[11%] w-[3px] rounded-r-sm bg-[#6b6b70]" />
        <span aria-hidden className="absolute -right-[2px] top-[34%] h-[6%] w-[3px] rounded-r-sm bg-[#6b6b70]" />
        <div className="h-full w-full rounded-[24px] bg-black p-[4px]">
          <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-surface-2">
            {screen}
            <div className="absolute left-1/2 top-2.5 h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[390/844] rounded-[44px] bg-bezel p-[7px] shadow-[0_30px_60px_-20px_rgb(29_29_31/0.35)] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[37px] bg-surface-2">
        {screen}
        {island ?? (
          <div className="absolute left-1/2 top-2.5 h-[22px] w-[30%] -translate-x-1/2 rounded-full bg-bezel" />
        )}
      </div>
    </div>
  );
}
