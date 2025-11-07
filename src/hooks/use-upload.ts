import { useMutation } from "@tanstack/react-query";
import { uploadApi, type UploadResponse } from "@/lib/api/upload-api";

export function useUploadSchoolLogo() {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: (file: File) => uploadApi.uploadSchoolLogo(file),
  });
}

export function useUploadProfileImage() {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: (file: File) => uploadApi.uploadProfileImage(file),
  });
}
