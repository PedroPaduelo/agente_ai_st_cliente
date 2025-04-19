import { TransbordoTable } from "./TransbordoTable";
import { TransbordoFilterSection } from "./TransbordoFilterSection";
import { useTransbordosContext } from "../context";
import { PageSkeleton } from "@/components-custom/skeletons/TableSkeleton";

export function TransbordoContent() {
  const { isLoading } = useTransbordosContext();

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <TransbordoFilterSection />
      <TransbordoTable />
    </div>
  );
}
