export type Tile = string;

export type Grid = Tile[][];

export type CabanaCoordinates = {
  x: number;
  y: number;
}

export type CabanaId = `cabana-${CabanaCoordinates['x']}:${CabanaCoordinates['y']}`;

export type Cabana = {
  id: CabanaId;
  isReserved: boolean;
  guestName: null | string;
} & CabanaCoordinates;

export type CabanaPublic = Omit<Cabana, 'id'>;

export type CabanasMap = Map<CabanaId, Cabana>;
