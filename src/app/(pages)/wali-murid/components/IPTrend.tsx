interface SemesterData {
  semester: number;
  ipk: number;
  label?: string;
}

interface IPKProgressListProps {
  data?: SemesterData[];
  maxIpk?: number;
  showLabels?: boolean;
}

const IPKProgressList = ({
  data,
  maxIpk = 4.0,
  showLabels = false,
}: IPKProgressListProps) => {
  const defaultData: SemesterData[] = [
    { semester: 1, ipk: 3.2, label: "Baik" },
    { semester: 2, ipk: 3.5, label: "Baik" },
    { semester: 3, ipk: 3.8, label: "Sangat Baik" },
    { semester: 4, ipk: 3.6, label: "Baik" },
    { semester: 5, ipk: 3.9, label: "Sangat Baik" },
  ];

  const displayData = data || defaultData;

  const getProgressColor = (ipk: number) => {
    if (ipk >= 3.5) return "bg-green-500";
    if (ipk >= 3.0) return "bg-blue-500";
    if (ipk >= 2.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getColorLabel = (ipk: number) => {
    if (ipk >= 3.5) return "Sangat Baik";
    if (ipk >= 3.0) return "Baik";
    if (ipk >= 2.5) return "Cukup";
    return "Perlu Perbaikan";
  };

  return (
    <div className="space-y-6">
      {displayData.map((item) => {
        const percentage = (item.ipk / maxIpk) * 100;
        const progressColor = getProgressColor(item.ipk);
        const colorLabel = getColorLabel(item.ipk);

        return (
          <div key={item.semester} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-28 flex items-center">
                  <span className="font-semibold text-gray-700">
                    Semester {item.semester}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  IPK: {item.ipk.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {showLabels && (
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {item.label || colorLabel}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {item.ipk.toFixed(2)}/{maxIpk}
                </span>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>0</span>
                    <span>1.0</span>
                    <span>2.0</span>
                    <span>3.0</span>
                    <span>{maxIpk}</span>
                  </div>
                </div>
              </div>
              <div
                className="absolute top-0 w-3 h-3 -mt-0.5 rounded-full bg-white border-2 border-gray-700 shadow-sm"
                style={{ left: `calc(${percentage}% - 6px)` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IPKProgressList;
