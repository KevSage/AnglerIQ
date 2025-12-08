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

  const apiKey = process.env.GEOCODING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEOCODING_API_KEY is not set on the server" },
      { status: 500 }
    );
  }

  try {
    // Example using OpenCage
    const resp = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&no_annotations=1`
    );

    if (!resp.ok) {
      const text = await resp.text();
      console.log("Reverse geocode error:", text);
      return NextResponse.json(
        { error: "Reverse geocode provider error" },
        { status: 500 }
      );
    }

    const data = await resp.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: "No location found for coordinates" },
        { status: 404 }
      );
    }

    const best = data.results[0];
    const components = best.components || {};

    const waterName =
      components.water ||
      components.lake ||
      components.reservoir ||
      components.body_of_water;

    const city =
      components.city ||
      components.town ||
      components.village ||
      components.hamlet ||
      null;

    const county = components.county || null;

    const stateCode =
      components.state_code || // e.g., "GA"
      components.state || // e.g., "Georgia"
      null;

    const country = components.country;
    const label = best.formatted as string;

    return NextResponse.json({
      water_name: waterName || null,
      city: city || null,
      county,
      state: stateCode || null,
      country: country || null,
      label,
    });
  } catch (err) {
    console.log("Reverse geocode exception:", err);
    return NextResponse.json(
      { error: "Failed to reverse geocode" },
      { status: 500 }
    );
  }
}
