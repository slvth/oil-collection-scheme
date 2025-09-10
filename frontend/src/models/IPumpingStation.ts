export interface IPumpingStation {
  pumping_station_id: number;
  name: string;
  pressure_working: number;
  tank_volume: number;
  throughput: number;
  pump_performance: number;
  longitude: number;
  latitude: number;
  scheme_id: number;
}
