const DRIVER_API_BASE_URL = (
  process.env.EXPO_PUBLIC_DRIVER_API_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

type RequestOptions = {
  method?: 'GET' | 'PUT' | 'PATCH' | 'POST';
  body?: unknown;
};

async function request<T>(path: string, accessToken: string, options: RequestOptions = {}): Promise<T> {
  if (!accessToken.trim()) {
    throw new Error('A driver or admin access token is required.');
  }

  const response = await fetch(`${DRIVER_API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });

  if (!response.ok) {
    const message = await response.text();
    let detail = message;
    try {
      const payload: unknown = JSON.parse(message);
      if (typeof payload === 'object' && payload !== null && 'detail' in payload && typeof payload.detail === 'string') {
        detail = payload.detail;
      } else if (typeof payload === 'object' && payload !== null && 'message' in payload && typeof payload.message === 'string') {
        detail = payload.message;
      }
    } catch {
      detail = message;
    }
    throw new Error(detail || `Driver API request failed (${response.status}).`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const driverApi = {
  getMyProfile: <T = unknown>(token: string) =>
    request<T>('/api/drivers/me', token),

  updateMyProfile: <T = unknown>(token: string, profile: unknown) =>
    request<T>('/api/drivers/me', token, { method: 'PUT', body: profile }),

  updateMyAvailability: <T = unknown>(token: string, availability: unknown) =>
    request<T>('/api/drivers/me/availability', token, { method: 'PATCH', body: availability }),

  getMyActiveRides: <T = unknown>(token: string) =>
    request<T>('/api/drivers/me/rides', token),

  getMyRideHistory: <T = unknown>(token: string) =>
    request<T>('/api/drivers/me/rides/history', token),

  getMyStats: <T = unknown>(token: string) =>
    request<T>('/api/drivers/me/stats', token),

  getAvailableRides: <T = unknown>(token: string) =>
    request<T>('/api/rides/available', token),

  acceptRide: <T = unknown>(token: string, rideId: string) =>
    request<T>(`/api/rides/${encodeURIComponent(rideId)}/accept`, token, { method: 'POST' }),

  updateRideStatus: <T = unknown>(token: string, rideId: string, status: unknown) =>
    request<T>(`/api/rides/${encodeURIComponent(rideId)}/status`, token, { method: 'PATCH', body: status }),

  listDrivers: <T = unknown>(token: string) =>
    request<T>('/api/admin/drivers', token),

  getDriver: <T = unknown>(token: string, driverId: string) =>
    request<T>(`/api/admin/drivers/${encodeURIComponent(driverId)}`, token),

  decideDriverApproval: <T = unknown>(token: string, driverId: string, decision: unknown) =>
    request<T>(`/api/admin/drivers/${encodeURIComponent(driverId)}/approval`, token, { method: 'PATCH', body: decision }),

  changeDriverSuspension: <T = unknown>(token: string, driverId: string, suspension: unknown) =>
    request<T>(`/api/admin/drivers/${encodeURIComponent(driverId)}/suspend`, token, { method: 'PATCH', body: suspension }),

  getAdminStats: <T = unknown>(token: string) =>
    request<T>('/api/admin/stats', token),
};