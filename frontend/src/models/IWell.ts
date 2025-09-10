export interface IWell {
  well_id?: number;
  name: string;
  drive_type_id: number;
  well_pump_id: number;
  water_cut: number;
  flow_rate: number;
  flow_rate_oil: number;
  longitude: number;
  latitude: number;
  scheme_id: number;
}
