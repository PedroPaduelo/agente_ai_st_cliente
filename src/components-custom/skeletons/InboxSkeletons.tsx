import { Skeleton } from "../ui/skeleton";

export function ChatItemSkeleton() {
  return (
    <div className="border-b p-3">
      <div className="flex justify-between items-start mb-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-4 w-full mt-2" />
      <div className="flex gap-4 mt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <div className="divide-y">
      {Array(5).fill(0).map((_, index) => (
        <ChatItemSkeleton key={index} />
      ))}
    </div>
  );
}

export function MessageSkeleton({ 
  align = "left",
  isRetry = false 
}: { 
  align?: "left" | "right";
  isRetry?: boolean;
}) {
  return (
    <div className={`flex ${align === "left" ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`flex max-w-[80%] ${align === "left" ? "flex-row" : "flex-row-reverse"}`}>
        <div className={`flex-shrink-0 ${align === "left" ? "mr-2" : "ml-2"}`}>
          <Skeleton className={`h-8 w-8 rounded-full ${isRetry ? "bg-amber-300/50" : ""}`} />
        </div>
        <div className="flex-grow-0">
          {isRetry && <Skeleton className="h-3 w-20 mb-1 rounded bg-amber-200/50" />}
          <Skeleton className={`rounded-lg h-12 w-40 ${isRetry ? "bg-amber-100/50 border border-amber-200/50" : ""}`} />
          <div className="flex mt-1 items-center">
            <Skeleton className="h-3 w-12" />
            {isRetry && <Skeleton className="h-3 w-8 ml-2 bg-amber-100/50 rounded-sm" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessagesListSkeleton() {
  return (
    <div className="space-y-4">
      <MessageSkeleton align="left" />
      <MessageSkeleton align="right" />
      <MessageSkeleton align="left" isRetry={true} />
      <MessageSkeleton align="right" />
      <MessageSkeleton align="left" />
    </div>
  );
}

export function ChatHeaderSkeleton() {
  return (
    <div className="pb-3 border-b p-4 space-y-2">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-60" />
    </div>
  );
}

export function ChatInputSkeleton() {
  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Skeleton className="flex-1 h-10 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
    </div>
  );
}
