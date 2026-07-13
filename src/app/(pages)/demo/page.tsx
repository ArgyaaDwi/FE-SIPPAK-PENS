import PredictFeature from "@/components/feature/predict/PredictFeature";

export default function DemoPage() {
  return (
    // Tidak masuk database, tidak butuh login
    <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-0">
      <PredictFeature isDemo={true} role="DEMO" />
    </div>
  );
}
