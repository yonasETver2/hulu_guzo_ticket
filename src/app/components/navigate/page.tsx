import { Suspense } from "react";
import NavigateSiteClient from "./NavigateSiteClient";

// REQUIRED because NavigateToInst uses useSearchParams
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavigateSiteClient />
    </Suspense>
  );
}
