import { api } from "./client";

export interface Address {
  id: string;
  userId: string;
  title: "Home" | "Work" | "Other";
  label: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressListResponse {
  addresses: Address[];
}

interface AddressResponse {
  address: Address;
}

interface SearchResult {
  label: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  country: string;
  region: string;
  locality: string;
}

interface SearchResponse {
  results: SearchResult[];
}

export const addressesApi = {
  list: () =>
    api.get<AddressListResponse>("/addresses").then((r) => r.data),

  create: (data: {
    title: string;
    label?: string;
    address: string;
    lat?: number;
    lng?: number;
    isDefault?: boolean;
  }) =>
    api.post<AddressResponse>("/addresses", data).then((r) => r.data),

  update: (
    id: string,
    data: {
      title?: string;
      label?: string;
      address?: string;
      lat?: number;
      lng?: number;
      isDefault?: boolean;
    },
  ) => api.put<AddressResponse>(`/addresses/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/addresses/${id}`).then((r) => r.data),

  setDefault: (id: string) =>
    api.put<AddressResponse>(`/addresses/${id}/default`).then((r) => r.data),

  searchPlaces: (q: string) =>
    api
      .get<SearchResponse>("/addresses/search", { params: { q } })
      .then((r) => r.data),

  reverseGeocode: (lat: number, lng: number) =>
    api
      .get<{ result: { label: string; address: string; lat: number; lng: number } | null }>(
        "/addresses/reverse",
        { params: { lat, lng } },
      )
      .then((r) => r.data),
};
