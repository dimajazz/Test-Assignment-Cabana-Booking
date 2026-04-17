import { http } from "./http";
import { MapApiResponse } from "@models/map.types";

export async function fetchMap(): Promise<MapApiResponse> {
  return http<MapApiResponse>('/api/map');
}
