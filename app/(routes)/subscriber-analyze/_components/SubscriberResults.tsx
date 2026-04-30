interface Props {
  data: any;
}

export default function SubscriberResults({ data }: Props) {
  if (!data) return null;

  const { yourData, competitorData } = data;

  return (
    <div className="mt-8 space-y-8">

      {/* ---------------- Your Channel ---------------- */}
      <div className="border p-6 rounded-lg bg-gray-50 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">
          {yourData.title}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Subscribers:</strong> {yourData.subscribers}</p>
          <p><strong>Average Views:</strong> {yourData.avgViews}</p>
          <p><strong>Reach %:</strong> {yourData.reachPercent}%</p>
          <p><strong>Engagement Rate:</strong> {yourData.engagementRate}%</p>
          <p><strong>Trend:</strong> {yourData.trendPercent}%</p>
          <p><strong>Posting Frequency:</strong> {yourData.postingFrequency}</p>
        </div>

        <p className="mt-4 text-lg font-semibold">
          Health Score: {yourData.healthScore}/100
        </p>
      </div>

      {/* ---------------- AI REPORT ---------------- */}
      {yourData.ai && (
        <div className="border p-6 rounded-lg bg-white shadow">
          <h3 className="text-xl font-bold mb-4">
            🧠 AI Growth Report
          </h3>

          {/* Diagnosis */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">
              Diagnosis
            </h4>
            <p className="text-gray-700">
              {yourData.ai.diagnosis}
            </p>
          </div>

          {/* Recommendations */}
          {yourData.ai.recommendations?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">
                Recommendations
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {yourData.ai.recommendations.map(
                  (rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Biggest Opportunity */}
          {yourData.ai.biggestOpportunity && (
            <div>
              <h4 className="font-semibold mb-2">
                Biggest Growth Opportunity
              </h4>
              <p className="text-gray-800 font-medium">
                {yourData.ai.biggestOpportunity}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---------------- Competitor ---------------- */}
      {competitorData && (
        <div className="border p-6 rounded-lg bg-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-3">
            Competitor Comparison
          </h2>

          <p>
            <strong>Your Reach:</strong>{" "}
            {yourData.reachPercent}%
          </p>

          <p>
            <strong>Competitor Reach:</strong>{" "}
            {competitorData.reachPercent}%
          </p>

          <p className="mt-3 font-semibold">
            {competitorData.reachPercent >
            yourData.reachPercent
              ? "Competitor is activating subscribers better."
              : "You are outperforming competitor in subscriber reach."}
          </p>
        </div>
      )}
    </div>
  );
}