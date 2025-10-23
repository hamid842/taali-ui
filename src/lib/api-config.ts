const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      register: `${API_BASE_URL}/auth/register`,
      verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
      resendOtp: `${API_BASE_URL}/auth/resend-otp`,
      login: `${API_BASE_URL}/auth/login`,
    },
  },
  headers: {
    "Content-Type": "application/json",
  },
};

// Generic API client
export const apiClient = {
  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: apiConfig.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};
