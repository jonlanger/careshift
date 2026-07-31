import type { Metadata } from "next";
import { BriefFlow } from "@/components/brief/brief-flow";
import { getFixture } from "@/data/fixtures";

export const metadata: Metadata = {
  title: "Shift brief",
};

type Props = {
  searchParams: Promise<{ fixture?: string }>;
};

export default async function BriefPage({ searchParams }: Props) {
  const params = await searchParams;
  const fixture = getFixture(params.fixture);

  return <BriefFlow fixture={fixture} />;
}
