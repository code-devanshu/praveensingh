import { site } from "@/content";

export const dynamic = "force-static";

// vCard text needs commas, semicolons and backslashes escaped.
const escape = (text: string) => text.replace(/([\\,;])/g, "\\$1").replace(/\n/g, "\\n");

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
    "END:VCARD",
    "",
  ].join("\r\n");

  return new Response(card, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="Praveen Singh.vcf"',
    },
  });
}
