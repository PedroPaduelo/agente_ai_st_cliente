import { RetryTable } from "./RetryTable";
import { RetryFilterSection } from "./RetryFilterSection";
import { useRetryContext } from "../context";
import { PageSkeleton } from "@/components-custom/skeletons/TableSkeleton";

export function RetryContent() {
  const { isLoading } = useRetryContext();

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <RetryFilterSection />
      <RetryTable />
    </div>
  );
}
