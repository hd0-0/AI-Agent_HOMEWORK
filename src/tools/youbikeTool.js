const YOUBIKE_URL = "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";

export const youbikeTool = {
  type: "function",
  function: {
    name: "find_youbike_by_area",
    description: "依照台北市行政區名稱查詢 YouBike 可借車輛站點，例如：大安區、信義區",
    parameters: {
      type: "object",
      properties: {
        area: {
          type: "string",
          description: "台北市行政區名稱，例如：大安區、信義區"
        }
      },
      required: ["area"]
    }
  }
};

function getRentCount(station) {
  return Number(station.available_rent_bikes ?? station.sbi ?? 0);
}

function getReturnCount(station) {
  return Number(station.available_return_bikes ?? station.bemp ?? 0);
}

export async function findYouBikeByArea({ area }) {
  let response;
  try {
    response = await fetch(YOUBIKE_URL);
  } catch (error) {
    return {
      error: true,
      message: `YouBike 資料連線失敗：${error.message}`
    };
  }

  if (!response.ok) {
    return {
      error: true,
      message: `YouBike 資料取得失敗：${response.status}`
    };
  }

  const stations = await response.json();
  const matched = stations
    .filter((station) => station.sarea === area)
    .filter((station) => String(station.act) === "1")
    .filter((station) => getRentCount(station) > 0)
    .sort((a, b) => getRentCount(b) - getRentCount(a))
    .slice(0, 5)
    .map((station) => ({
      name: station.sna?.replace("YouBike2.0_", "") || station.sna,
      area: station.sarea,
      address: station.ar,
      available_rent_bikes: getRentCount(station),
      available_return_bikes: getReturnCount(station),
      update_time: station.mday
    }));

  if (matched.length === 0) {
    return {
      area,
      count: 0,
      stations: [],
      message: `查不到 ${area} 目前可借的 YouBike 站點，請確認是否輸入台北市行政區名稱。`
    };
  }

  return {
    area,
    count: matched.length,
    stations: matched
  };
}
