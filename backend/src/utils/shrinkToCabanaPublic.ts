import { Cabana, CabanaPublic } from '../types/map';

export function shrinkToCabanaPublic(cabana: Cabana): CabanaPublic {
  const { id, ...rest } = cabana;
  return rest;
}
