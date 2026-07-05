import { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Search",
  description: `Search ${SITE.title}`,
};

export default function SearchPageLayout() {
  // This is a wrapper — actual content is in the client component
  // We're importing the client component in page.tsx
  return null;
}
