import PredictFeature from "@/components/feature/predict/PredictFeature";

export default function DemoPage() {
  return (
    // Tidak masuk database, tidak butuh login
    <div className="max-w-5xl mx-auto py-8">
      <PredictFeature isDemo={true} role="DEMO" />
    </div>
  );
}
