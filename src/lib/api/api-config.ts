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
    school: {
      getAll: (schoolId: number) =>
        `${API_BASE_URL}/school/${schoolId}/timestamps`,
      create: (schoolId: number) =>
        `${API_BASE_URL}/school/${schoolId}/timestamps`,
      update: (timestampId: number) =>
        `${API_BASE_URL}/school/timestamps/${timestampId}`,
      delete: (timestampId: number) =>
        `${API_BASE_URL}/school/timestamps/${timestampId}`,
      getAvailableTypes: (schoolId: number) =>
        `${API_BASE_URL}/school/${schoolId}/available-timestamp-types`,
    },
    upload: {
      schoolLogo: `${API_BASE_URL}/upload/school-logo`,
      profileImage: `${API_BASE_URL}/upload/profile-image`,
    },
    users: {
      list: `${API_BASE_URL}/users`,
      getById: (id: string) => `${API_BASE_URL}/users/${id}`,
      create: `${API_BASE_URL}/users`,
      update: (id: string) => `${API_BASE_URL}/users/${id}`,
      updateStatus: (id: string) => `${API_BASE_URL}/users/${id}/status`,
      delete: (id: string) => `${API_BASE_URL}/users/${id}`,
      search: `${API_BASE_URL}/users/search`,
    },
    classes: {
      create: `${API_BASE_URL}/school-classes`,
      getById: (id: number) => `${API_BASE_URL}/school-classes/${id}`,
      update: (id: number) => `${API_BASE_URL}/school-classes/${id}`,
      delete: (id: number) => `${API_BASE_URL}/school-classes/${id}`,
      getBySchool: (schoolId: number) =>
        `${API_BASE_URL}/school-classes/school/${schoolId}`,
      getActiveBySchool: (schoolId: number) =>
        `${API_BASE_URL}/school-classes/school/${schoolId}/active`,
      addStudent: (classId: number, studentId: number) =>
        `${API_BASE_URL}/school-classes/${classId}/students/${studentId}`,
      removeStudent: (classId: number, studentId: number) =>
        `${API_BASE_URL}/school-classes/${classId}/students/${studentId}`,
      getSchedulesByClass: (classId: number) =>
        `${API_BASE_URL}/class-schedules/class/${classId}`,
    },
    schedules: {
      create: `${API_BASE_URL}/class-schedules`,
      update: (id: number) => `${API_BASE_URL}/class-schedules/${id}`,
      delete: (id: number) => `${API_BASE_URL}/class-schedules/${id}`,
      getByClass: (classId: number) =>
        `${API_BASE_URL}/class-schedules/class/${classId}`,
      getByClassAndDay: (classId: string, dayOfWeek: string) =>
        `${API_BASE_URL}/class-schedules/class/${classId}/day/${dayOfWeek}`,
      getByTeacher: (teacherId: string) =>
        `${API_BASE_URL}/class-schedules/teacher/${teacherId}`,
    },
    lessons: {
      getAll: `${API_BASE_URL}/lessons`,
      getByGradeLevel: (gradeLevel: string) =>
        `${API_BASE_URL}/lessons/grade-level/${encodeURIComponent(gradeLevel)}`,
    },
    teachers: {
      create: `${API_BASE_URL}/teachers`,
      getById: (id: number) => `${API_BASE_URL}/teachers/${id}`,
      update: (id: number) => `${API_BASE_URL}/teachers/${id}`,
      delete: (id: number) => `${API_BASE_URL}/teachers/${id}`,
      updateStatus: (id: number) => `${API_BASE_URL}/teachers/${id}/status`,
      getBySchool: (schoolId: number) =>
        `${API_BASE_URL}/teachers/school/${schoolId}`,
      search: `${API_BASE_URL}/teachers/search`,
      getBySubject: `${API_BASE_URL}/teachers/by-subject`,
      getActiveBySchool: (schoolId: number) =>
        `${API_BASE_URL}/teachers/school/${schoolId}/active`,
      getDashboardStats: (id: number) =>
        `${API_BASE_URL}/teachers/${id}/dashboard/stats`,
      getTeacherClasses: (id: number) =>
        `${API_BASE_URL}/teachers/${id}/classes`,
      getUpcomingClasses: (id: number) =>
        `${API_BASE_URL}/teachers/${id}/upcoming-classes`,
      getTodaySchedule: (id: number) =>
        `${API_BASE_URL}/teachers/${id}/today-schedule`,
      getRecentActivity: (id: number) =>
        `${API_BASE_URL}/teachers/${id}/recent-activity`,
      assignClass: (teacherId: number) =>
        `${API_BASE_URL}/teachers/${teacherId}/assign-classes`,
    },
    students: {
      getBySchool: (schoolId: number) =>
        `${API_BASE_URL}/students/school/${schoolId}`,
      getById: (id: number) => `${API_BASE_URL}/students/${id}`,
      getByClass: (classId: number) =>
        `${API_BASE_URL}/students/class/${classId}`,
      getByUser: (userId: number) => `${API_BASE_URL}/students/user/${userId}`,
      updateDetailsByUser: (userId: number) =>
        `${API_BASE_URL}/students/user/${userId}/details`,
      associateParents: (userId: number) =>
        `${API_BASE_URL}/students/user/${userId}/parents`,
      getGradeLevels: (schoolId: number) =>
        `${API_BASE_URL}/students/school/${schoolId}/grade-levels`,
      getClasses: (schoolId: number) => `/students/school/${schoolId}/classes`,
      assignClass: (studentId: number) =>
        `${API_BASE_URL}/students/${studentId}/assign-class`,
      removeFromClass: (studentId: number) =>
        `${API_BASE_URL}/students/${studentId}/class`,
      bulkAssign: `${API_BASE_URL}/students/bulk-assign-class`,
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
