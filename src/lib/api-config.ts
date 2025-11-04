const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Get user's preferred language from localStorage, i18n, or browser
const getPreferredLanguage = (): string => {
  return localStorage.getItem("selectedLanguage") || "fa";
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
      create: `${API_BASE_URL}/schools`,
      getById: (id: string) => `${API_BASE_URL}/schools/${id}`,
      update: (id: string) => `${API_BASE_URL}/schools/${id}`,
      delete: (id: string) => `${API_BASE_URL}/schools/${id}`,
      updateLogo: (id: string) => `${API_BASE_URL}/schools/${id}/logo`,
      search: `${API_BASE_URL}/schools/search`,
    },
    upload: {
      schoolLogo: `${API_BASE_URL}/upload/school-logo`,
      profileImage: `${API_BASE_URL}/upload/profile-image`,
    },
  },
  headers: {
    "Content-Type": "application/json",
  },
};

// Generic API client
export const apiClient = {
  async post<T>(
    url: string,
    data: unknown,
    options?: {
      language?: string;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    const preferredLanguage = options?.language || getPreferredLanguage();
    const token = getAuthToken();

    const headers: Record<string, string> = {
      ...apiConfig.headers,
      "Accept-Language": preferredLanguage,
      ...options?.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Don't stringify FormData
    const body = data instanceof FormData ? data : JSON.stringify(data);

    // Remove Content-Type for FormData to let browser set it with boundary
    if (data instanceof FormData) {
      delete headers["Content-Type"];
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          result.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },

  async get<T>(
    url: string,
    options?: {
      language?: string;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    const preferredLanguage = options?.language || getPreferredLanguage();
    const token = getAuthToken();

    const headers: Record<string, string> = {
      "Accept-Language": preferredLanguage,
      ...options?.headers,
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
        result.error ||
          result.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },

  async put<T>(
    url: string,
    data: unknown,
    options?: {
      language?: string;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    const preferredLanguage = options?.language || getPreferredLanguage();
    const token = getAuthToken();

    const headers: Record<string, string> = {
      ...apiConfig.headers,
      "Accept-Language": preferredLanguage,
      ...options?.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Don't stringify FormData
    const body = data instanceof FormData ? data : JSON.stringify(data);

    // Remove Content-Type for FormData to let browser set it with boundary
    if (data instanceof FormData) {
      delete headers["Content-Type"];
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          result.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },

  async patch<T>(
    url: string,
    data: unknown,
    options?: {
      language?: string;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    const preferredLanguage = options?.language || getPreferredLanguage();
    const token = getAuthToken();

    const headers: Record<string, string> = {
      ...apiConfig.headers,
      "Accept-Language": preferredLanguage,
      ...options?.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          result.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },

  async delete<T>(
    url: string,
    options?: {
      language?: string;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    const preferredLanguage = options?.language || getPreferredLanguage();
    const token = getAuthToken();

    const headers: Record<string, string> = {
      "Accept-Language": preferredLanguage,
      ...options?.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    // For DELETE requests, sometimes the response might be empty
    if (response.status === 204) {
      return {} as T;
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          result.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },

  // Specialized upload method for file uploads
  async upload<T>(
    url: string,
    formData: FormData,
    options?: {
      language?: string;
      onProgress?: (progress: number) => void;
    }
  ): Promise<T> {
    const preferredLanguage = options?.language || getPreferredLanguage();
    const token = getAuthToken();

    const headers: Record<string, string> = {
      "Accept-Language": preferredLanguage,
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Use XMLHttpRequest for progress tracking
    if (options?.onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            options.onProgress!(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (error) {
              console.log(error);
              reject(new Error("Failed to parse response"));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(
                new Error(
                  error.error || error.message || `Upload failed: ${xhr.status}`
                )
              );
            } catch {
              reject(
                new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`)
              );
            }
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.open("POST", url);

        // Set headers
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });

        xhr.send(formData);
      });
    }

    // Fallback to fetch if no progress tracking needed
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          result.message ||
          `Upload error: ${response.status} ${response.statusText}`
      );
    }

    return result;
  },
};

// Utility function to set language preference
export const setLanguagePreference = (language: string): void => {
  localStorage.setItem("selectedLanguage", language);
  // Also set for i18n if you're using it
  localStorage.setItem("i18nextLng", language);
};

// Utility function to get current language
export const getCurrentLanguage = (): string => {
  return getPreferredLanguage();
};

// Utility function to get full upload URL
export const getUploadUrl = (path: string): string => {
  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }
  return `${API_BASE_URL}/${path}`;
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Utility function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

// Utility function to remove auth token (logout)
export const removeAuthToken = (): void => {
  localStorage.removeItem("auth_token");
};
