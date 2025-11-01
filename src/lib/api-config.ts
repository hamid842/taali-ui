const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Get user's preferred language from localStorage, i18n, or browser
const getPreferredLanguage = (): string => {
  return localStorage.getItem("selectedLanguage")! || "fa";
};

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
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
    menu: {
      getUserMenu: `${API_BASE_URL}/menu/user`,
    },
    schools: {
      getMySchools: `${API_BASE_URL}/schools/my-schools`,
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
    const token = getAuthToken();

    const headers: Record<string, string> = {
      ...apiConfig.headers,
      "Accept-Language": preferredLanguage,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

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

  async get<T>(url: string, language?: string): Promise<T> {
    const preferredLanguage = language || getPreferredLanguage();
    const token = getAuthToken();

    const headers: Record<string, string> = {
      "Accept-Language": preferredLanguage,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

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
    const token = getAuthToken();

    const headers: Record<string, string> = {
      ...apiConfig.headers,
      "Accept-Language": preferredLanguage,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

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
    const token = getAuthToken();

    const headers: Record<string, string> = {
      "Accept-Language": preferredLanguage,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

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
