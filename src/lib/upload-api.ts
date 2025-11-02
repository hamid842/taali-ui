import { apiClient, apiConfig } from "./api-config";

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

export const uploadApi = {
  uploadSchoolLogo: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.upload<UploadResponse>(
      apiConfig.endpoints.upload.schoolLogo,
      formData,
      { onProgress }
    );
  },

  uploadProfileImage: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.upload<UploadResponse>(
      apiConfig.endpoints.upload.profileImage,
      formData,
      { onProgress }
    );
  },
};
