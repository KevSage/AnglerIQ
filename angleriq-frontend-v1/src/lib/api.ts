const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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
