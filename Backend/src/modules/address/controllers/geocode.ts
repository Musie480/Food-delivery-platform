import type { Request, Response } from "express";
import { z } from "zod";
import { env } from "../../../config/env.js";

const searchSchema = z.object({
  q: z.string().min(1),
});

export async function searchPlaces(req: Request, res: Response) {
  const { q } = searchSchema.parse(req.query);

  const url = new URL("https://api.openrouteservice.org/geocode/search");
  url.searchParams.set("api_key", env.orsApiKey);
  url.searchParams.set("text", q);
  url.searchParams.set("size", "8");

  const response = await fetch(url.toString());
  if (!response.ok) {
    res.status(502).json({ message: "Geocoding service unavailable" });
    return;
  }

  const data = (await response.json()) as { features: Array<{ geometry: { coordinates: [number, number] }; properties: { label: string; name: string; country: string; county: string; locality: string; region: string } }> };

  const results = (data.features ?? []).map((f) => ({
    label: f.properties.label,
    name: f.properties.name,
    address: f.properties.label,
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    country: f.properties.country,
    region: f.properties.region,
    locality: f.properties.locality,
  }));

  res.json({ results });
}

export async function reverseGeocode(req: Request, res: Response) {
  const schema = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
  });
  const { lat, lng } = schema.parse(req.query);

  const url = new URL("https://api.openrouteservice.org/geocode/reverse");
  url.searchParams.set("api_key", env.orsApiKey);
  url.searchParams.set("point.lat", String(lat));
  url.searchParams.set("point.lon", String(lng));

  const response = await fetch(url.toString());
  if (!response.ok) {
    res.status(502).json({ message: "Geocoding service unavailable" });
    return;
  }

  const data = (await response.json()) as { features: Array<{ geometry: { coordinates: [number, number] }; properties: { label: string; name: string } }> };

  const result = data.features?.[0] ?? null;
  if (!result) {
    res.json({ result: null });
    return;
  }

  res.json({
    result: {
      label: result.properties.label,
      address: result.properties.label,
      lat: result.geometry.coordinates[1],
      lng: result.geometry.coordinates[0],
    },
  });
}
