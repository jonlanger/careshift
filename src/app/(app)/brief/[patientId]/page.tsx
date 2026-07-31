"use client";

import { useParams } from "next/navigation";
import { BriefFlow } from "@/components/brief/brief-flow";
import { PageBody } from "@/components/app/app-shell";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { useCareshift } from "@/lib/store";

export default function BriefPage() {
  const params = useParams<{ patientId: string }>();
  const { patients } = useCareshift();
  const patient = patients.find((p) => p.id === params.patientId);

  if (!patient) {
    return (
      <PageBody>
        <Card className="text-center">
          <h1 className="type-h2 text-ink">No brief found</h1>
          <p className="mt-2 text-base text-ink-muted">
            Pick someone from your caseload to start a brief.
          </p>
          <div className="mt-5 flex justify-center">
            <LinkButton href="/patients" variant="secondary">
              Go to patients
            </LinkButton>
          </div>
        </Card>
      </PageBody>
    );
  }

  return <BriefFlow patient={patient} />;
}
