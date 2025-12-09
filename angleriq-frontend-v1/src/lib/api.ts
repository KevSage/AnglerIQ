const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// TODO: replace `any` with your real request/response types later
export function generatePattern(payload: any) {
  return request<any>("/pattern/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
// /lib/config.ts

// src/lib/api.ts

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export const endpoints = {
  pattern: `${API_BASE_URL}/pattern`,
  vision: `${API_BASE_URL}/vision/fishfinder`,
  sage: `${API_BASE_URL}/assistant`,
};

// src/lib/api.ts

export type VisionAnalysis = {
  depth_ft: number | null;
  bottom_hardness: string | null;
  bait_present: boolean | null;
  fish_present: boolean | null;
  arch_count: number | null;
  activity_level: string | null;
  worth_fishing: boolean | null;
  stop_or_keep_moving: "stop" | "keep_moving" | null;
  raw_attributes: Record<string, unknown>;
};

export async function uploadVisionImage(file: File): Promise<VisionAnalysis> {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await fetch(`${BASE_URL}/vision/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) {
    throw new Error(`Vision analyze failed: ${resp.status}`);
  }

  return (await resp.json()) as VisionAnalysis;
}
