import { CabanaId } from "@models/map.types";

export function checkIsCabanaId(value: string | null | undefined): value is CabanaId {
  if (!value) {
    return false;
  }
  return /^cabana-\d+:\d+$/.test(value);
}
