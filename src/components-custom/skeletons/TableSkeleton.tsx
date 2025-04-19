// UI components we're actually using
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows: number;
  className?: string;
}

export function TableSkeleton({ columns, rows, className = "" }: TableSkeletonProps) {
  return (
    <div className={`rounded-md border ${className}`}>
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="bg-muted/50">
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CardTableSkeletonProps extends TableSkeletonProps {
  cardClassName?: string;
  title?: string;
  description?: boolean;
}

export function CardTableSkeleton({ 
  columns, 
  rows, 
  title, 
  description = true, 
  className = "",
  cardClassName = ""
}: CardTableSkeletonProps) {
  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle>
          {title ? title : <Skeleton className="h-6 w-48" />}
        </CardTitle>
        {description && (
          <CardDescription className="h-4 w-72 animate-pulse bg-primary/10 rounded-md" />
        )}
      </CardHeader>
      <CardContent>
        <TableSkeleton columns={columns} rows={rows} className={className} />
      </CardContent>
    </Card>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <CardTableSkeleton columns={6} rows={5} />
    </div>
  );
}

export function TransbordoSkeleton() {
  return <PageSkeleton />;
}

export function RetriesSkeleton() {
  return <PageSkeleton />;
}
