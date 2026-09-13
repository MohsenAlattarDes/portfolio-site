import type { Metadata } from "next";
import Footer from "@/components/Footer";
import WorkStack from "@/components/WorkStack";
import { routeMetadata, WORK_INDEX_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = routeMetadata({
  title: "Work",
  description: WORK_INDEX_DESCRIPTION,
  path: "/work",
});

export default function Work() {
  return (
    <div className="work-page relative flex w-full flex-1 flex-col">
      <h1 className="sr-only">Work</h1>
      <WorkStack />
      <Footer />
    </div>
  );
}
