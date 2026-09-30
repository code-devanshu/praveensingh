import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content";

export const dynamic = "force-static";

// vCard text needs commas, semicolons and backslashes escaped.
const escape = (text: string) => text.replace(/([\\,;])/g, "\\$1").replace(/\n/g, "\\n");

// Long lines are folded at 75 characters, continuing with a leading space.
const fold = (line: string) => line.match(/.{1,74}/g)?.join("\r\n ") ?? line;

// Shown against the contact on the visitor's phone. A 300px JPEG keeps the card small.
const photo = await readFile(join(process.cwd(), "src/assets/vcard/photo.jpg"));

// A contact card, so someone on a phone can add Praveen in one tap.
export function GET() {
  const [first, ...rest] = site.name.split(" ");
  const [city, country] = site.location.split(", ");
  const card = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(rest.join(" "))};${escape(first)};;;`,
    `FN:${escape(site.name)}`,
    `TITLE:${escape(site.role)}`,
    `EMAIL;TYPE=INTERNET,PREF:${site.email}`,
    `ADR;TYPE=WORK:;;;${escape(city)};;;${escape(country)}`,
    `URL;TYPE=LinkedIn:${site.linkedin}`,
    `URL;TYPE=GitHub:${site.github}`,
    `NOTE:${escape(site.description)}`,
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo.toString("base64")}`,
    "END:VCARD",
    "",
  ]
    .map(fold)
    .join("\r\n");

  return new Response(card, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="Praveen Singh.vcf"',
    },
  });
}
