import { Suspense } from "react";
import NavigateToInst from "./NavigateToInst";

// 🔴 REQUIRED because of useSearchParams
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavigateToInst />
    </Suspense>
  );
}
