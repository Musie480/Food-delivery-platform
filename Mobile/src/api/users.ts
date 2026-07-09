import { api } from "./client";
import type { User } from "../types/auth";

interface ProfileResponse {
  user: User;
}

export const usersApi = {
  getProfile: () =>
    api.get<ProfileResponse>("/auth/me").then((r) => r.data),

  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put<ProfileResponse>("/auth/profile", data).then((r) => r.data),

  uploadPhoto: (fileUri: string) => {
    const form = new FormData();
    form.append("file", {
      uri: fileUri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);
    return api
      .post<{ url: string }>("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};
