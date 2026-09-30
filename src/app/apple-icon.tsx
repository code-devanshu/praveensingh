import { monogram } from "@/lib/monogram";

// iOS rounds the corners itself, so this one is square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return monogram(size.width, "0");
}
