import type { Metadata } from "next";
import { WritingList } from "@/components/writing/WritingList";

export const metadata: Metadata = { title: "Writing" };

export default function WritingPage() {
  return (
    <>
      <p className="pb-3 text-muted">Writing</p>
      <WritingList />
    </>
  );
}