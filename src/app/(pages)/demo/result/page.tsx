import PredictResult from "@/components/feature/predict/PredictResult";

export default function DemoPredictResultPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <PredictResult isDemo={true} role="DEMO" />
    </div>
  );
}
