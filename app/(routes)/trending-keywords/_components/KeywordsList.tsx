"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function KeywordsList({ keywordsList, loading }: any) {
  return (
    <div className="mt-10">
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full rounded-lg h-10" />
          ))}
        </div>
      )}

      {keywordsList && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Keywords */}
          <div>
            <h2 className="font-medium text-lg my-2">Trending Keywords</h2>

            {keywordsList?.keywords?.map((item: any, index: number) => (
              <h2
                key={index}
                className="flex mt-2 justify-between items-center bg-secondary p-3 rounded-md"
              >
                {item.keyword}
                <span className="bg-yellow-500 text-white rounded-full px-2">
                  {item.score}
                </span>
              </h2>
            ))}
          </div>

          {/* Related Queries */}
          <div className="p-5 border rounded-xl">
            <h2 className="font-medium text-lg my-2">Related Queries</h2>

            {keywordsList?.keywords?.map((item: any, idx: number) =>
              item.related_queries?.map((query: string, i: number) => (
                <Badge key={`${idx}-${i}`} variant="secondary" className="m-1">
                  {query}
                </Badge>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default KeywordsList;