import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface Props {
  data: any
  loading?: boolean
}

export default function CompetitorResults({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="mt-10 space-y-10">

      {/* Channel Overview */}
      <div className="rounded-xl border p-6 bg-secondary/30">
        <h2 className="text-2xl font-bold mb-2">
          {data.channel.title}
        </h2>

        <div className="flex flex-wrap gap-3 mt-3">
          <Badge variant="secondary">
            Subscribers: {Number(data.channel.subscribers).toLocaleString()}
          </Badge>
          <Badge variant="secondary">
            Total Views: {Number(data.channel.totalViews).toLocaleString()}
          </Badge>
          <Badge variant="outline">
            Posting Frequency: {data.postingFrequency}
          </Badge>
        </div>
      </div>

      {/* Title Strategy */}
      {data.titlePatterns?.length > 0 && (
        <div className="rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">
            Title Strategy Patterns
          </h3>

          <div className="flex flex-wrap gap-2">
            {data.titlePatterns.map((pattern: string, index: number) => (
              <Badge key={index} className="text-sm px-3 py-1">
                {pattern}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* AI Competitive Intelligence */}
      {data.aiInsights && (
        <div className="rounded-xl border p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-xl font-bold mb-4">
            AI Competitive Intelligence
          </h3>

          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {data.aiInsights}
          </p>
        </div>
      )}

      {/* Top Performing Videos */}
      {data.topVideos?.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-6">
            Top Performing Videos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.topVideos.map((video: any) => (
              <div
                key={video.id}
                className="rounded-xl border p-4 hover:shadow-lg transition-all"
              >
                <Image
                  src={video.snippet.thumbnails.medium?.url}
                  alt={video.snippet.title}
                  width={300}
                  height={200}
                  className="rounded-lg w-full aspect-video object-cover"
                />

                <h4 className="font-semibold mt-3 line-clamp-2">
                  {video.snippet.title}
                </h4>

                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <span>
                    👁 {Number(video.statistics.viewCount).toLocaleString()}
                  </span>
                  <span>
                    👍 {Number(video.statistics.likeCount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}