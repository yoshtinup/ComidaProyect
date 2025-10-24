import { useEffect, useState } from "react";
import { Package } from "lucide-react";

const MAX_UNITS = 10;

const snackColors = {
  "Snack A": {
    bg: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    text: "text-blue-600",
    fill: "bg-blue-500",
  },
  "Snack B": {
    bg: "from-green-50 to-green-100",
    border: "border-green-200",
    text: "text-green-600",
    fill: "bg-green-500",
  },
  "Snack C": {
    bg: "from-orange-50 to-orange-100",
    border: "border-orange-200",
    text: "text-orange-600",
    fill: "bg-orange-500",
  },
};

function BodyDispenserProducts() {
  const [snacks, setSnacks] = useState({
    "Snack A": 0,
    "Snack B": 0,
    "Snack C": 0,
  });

  useEffect(() => {
    const ws = new WebSocket("wss://wscinesnacks.acstree.xyz/ws?account=Dispensador_001");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const content = JSON.parse(data.content);
        const { sensor, valor } = content;

        if (snackColors[sensor]) {
          setSnacks((prev) => ({ ...prev, [sensor]: valor }));
        }
      } catch (error) {
        console.error("Error parsing WebSocket data", error);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="self-stretch p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          Estado del Dispensador
        </h3>
        <span className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
          Dispensador_001
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(snacks).map(([snack, value]) => {
          const percentage = Math.min((value / MAX_UNITS) * 100, 100);
          const colors = snackColors[snack];

          return (
            <div
              key={snack}
              className={`bg-gradient-to-r ${colors.bg} p-4 rounded-lg border ${colors.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className={`text-sm font-medium ${colors.text} font-['Plus_Jakarta_Sans']`}>
                    {snack}
                  </p>
                  <p className="text-xl font-bold text-gray-800 font-['Plus_Jakarta_Sans']">
                    {value} / {MAX_UNITS}
                  </p>
                </div>
                <Package className={`h-8 w-8 ${colors.text}`} />
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${colors.fill} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BodyDispenserProducts;
