import React from "react";
import { Card } from "@/Components/ui/Card";
import { Skeleton } from "@/Components/ui/Skeleton";

export function AuctionCardSkeleton() {
  return (
    <Card className="relative overflow-hidden p-0 h-full min-h-[350px] border-white/5 bg-white/5">
      <div className="p-6 flex flex-col h-full justify-end relative z-10">
        <div className="mb-auto">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>

        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </Card>
  );
}
