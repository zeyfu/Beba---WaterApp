const LAT = -11.4343;
const LON = -61.4562;

// 🔹 Buscar temperatura
export async function getWeather() {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-11.4343&longitude=-61.4562&current=temperature_2m"
    );

    const data = await response.json();

    return data.current.temperature_2m;
  } catch (error) {
    console.log("Erro ao buscar clima:", error);
    return null;
  }
}

// 🔹 Calcular meta baseada na temperatura
export function calculateGoal(baseGoal, temperature) {
  if (!temperature) return baseGoal;

  if (temperature >= 35) return baseGoal + 1000;
  if (temperature >= 30) return baseGoal + 700;
  if (temperature >= 25) return baseGoal + 400;

  return baseGoal;
}