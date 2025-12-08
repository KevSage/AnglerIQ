import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "WEATHER_API_KEY is not set on the server" },
      { status: 500 }
    );
  }

  try {
    const weatherResp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    );

    if (!weatherResp.ok) {
      const text = await weatherResp.text();
      console.log("Weather API error:", text);
      return NextResponse.json(
        { error: "Weather provider error" },
        { status: 500 }
      );
    }

    const weatherData = await weatherResp.json();

    const temp_f: number | undefined = weatherData.main?.temp;
    const wind_speed: number | undefined = weatherData.wind?.speed;
    const rawDesc: string =
      weatherData.weather?.[0]?.description?.toLowerCase() || "";

    let sky_condition = "cloudy";
    if (rawDesc.includes("clear") || rawDesc.includes("sun")) {
      sky_condition = "sunny";
    } else if (rawDesc.includes("cloud")) {
      sky_condition = "cloudy";
    } else if (
      rawDesc.includes("rain") ||
      rawDesc.includes("drizzle") ||
      rawDesc.includes("storm") ||
      rawDesc.includes("thunder")
    ) {
      sky_condition = "cloudy";
    }

    return NextResponse.json({
      temp_f,
      wind_speed,
      sky_condition,
      raw_description: rawDesc,
    });
  } catch (err) {
    console.log("Weather API exception:", err);
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
