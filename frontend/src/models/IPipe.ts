export interface IPipe {
  pipe_id: number;
  name: string;
  start_object_id: number;
  start_object_type_id: number;
  end_object_id: number;
  end_object_type_id: number;
  coordinates: GeoPoint[];
  scheme_id: number;
}

interface GeoPoint {
  latitude: number;
  longitude: number;
}
