import { Skeleton } from "@/components/ui/skeleton";

export default function CommentResults({
  data,
  loading,
}: any) {
  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <Skeleton className="h-[220px] rounded-xl" />
        <Skeleton className="h-[220px] rounded-xl" />
        <Skeleton className="h-[220px] rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mt-8 grid grid-cols-1 gap-6">

      {/* Complaints */}
      <div className="border p-6 rounded-xl bg-red-50">
        <h2 className="font-bold text-xl mb-4">
          😡 Viewer Complaints
        </h2>

        <ul className="space-y-2 text-sm">
          {data.complaints?.length > 0 ? (
            data.complaints.map(
              (item: string, index: number) => (
                <li key={index}>
                  • {item}
                </li>
              )
            )
          ) : (
            <li>No complaints found</li>
          )}
        </ul>
      </div>

      {/* Questions */}
      <div className="border p-6 rounded-xl bg-blue-50">
        <h2 className="font-bold text-xl mb-4">
          ❓ Questions People Ask
        </h2>

        <ul className="space-y-2 text-sm">
          {data.questions?.length > 0 ? (
            data.questions.map(
              (item: string, index: number) => (
                <li key={index}>
                  • {item}
                </li>
              )
            )
          ) : (
            <li>No questions found</li>
          )}
        </ul>
      </div>

      {/* Ideas */}
      <div className="border p-6 rounded-xl bg-green-50">
        <h2 className="font-bold text-xl mb-4">
          💡 Content Ideas
        </h2>

        <ul className="space-y-2 text-sm">
          {data.ideas?.length > 0 ? (
            data.ideas.map(
              (item: string, index: number) => (
                <li key={index}>
                  • {item}
                </li>
              )
            )
          ) : (
            <li>No ideas found</li>
          )}
        </ul>
      </div>

    </div>
  );
}