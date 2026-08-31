import type { HealthResponse, ProfileResponse } from '../types/profile';

export interface HealthCheckResult {
  isHealthy: boolean;
  latencyMs: number;
  data?: HealthResponse;
  error?: string;
  checkedAt: Date;
}

export async function checkHealth(): Promise<HealthCheckResult> {
  const start = performance.now();
  try {
    const response = await fetch('/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const latencyMs = Math.round(performance.now() - start);

    if (!response.ok) {
      return {
        isHealthy: false,
        latencyMs,
        error: `HTTP ${response.status}: ${response.statusText}`,
        checkedAt: new Date(),
      };
    }

    const data: HealthResponse = await response.json();
    return {
      isHealthy: data.status === 'ok',
      latencyMs,
      data,
      checkedAt: new Date(),
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      isHealthy: false,
      latencyMs,
      error: err.message || 'Unable to connect to backend server',
      checkedAt: new Date(),
    };
  }
}

export async function fetchProfile(profileUrl: string): Promise<ProfileResponse> {
  const response = await fetch('/api/v1/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ profileUrl }),
  });

  const json = await response.json();

  if (!response.ok) {
    const message = json?.error?.message || json?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return json as ProfileResponse;
}
