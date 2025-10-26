const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Get user's preferred language from localStorage, i18n, or browser
const getPreferredLanguage = (): string => {
  return localStorage.getItem("selectedLanguage")!;
};

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
  async post<T>(url: string, data: unknown, language?: string): Promise<T> {
    const preferredLanguage = language || getPreferredLanguage();

    const headers = {
      ...apiConfig.headers,
      "Accept-Language": preferredLanguage,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },

  // Optional: Add other HTTP methods with language support
  async get<T>(url: string, language?: string): Promise<T> {
    const preferredLanguage = language || getPreferredLanguage();

    const headers = {
      "Accept-Language": preferredLanguage,
    };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },

  async put<T>(url: string, data: unknown, language?: string): Promise<T> {
    const preferredLanguage = language || getPreferredLanguage();

    const headers = {
      ...apiConfig.headers,
      "Accept-Language": preferredLanguage,
    };

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },

  async delete<T>(url: string, language?: string): Promise<T> {
    const preferredLanguage = language || getPreferredLanguage();

    const headers = {
      "Accept-Language": preferredLanguage,
    };

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },
};

// Utility function to set language preference
export const setLanguagePreference = (language: string): void => {
  localStorage.setItem("language", language);
  // Also set for i18n if you're using it
  localStorage.setItem("i18nextLng", language);
};

// Utility function to get current language
export const getCurrentLanguage = (): string => {
  return getPreferredLanguage();
};
