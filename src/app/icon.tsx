import { monogram } from "@/lib/monogram";

// The site icon (browser tab, search results, home screen). Search results
// need 48px or larger, which the old 16/32px favicon.ico wasn't.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return monogram(size.width, "22.5%");
}
