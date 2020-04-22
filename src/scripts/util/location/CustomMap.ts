export enum MapType {
  GAODE = 'gd', // 高德
  BAIDU = 'baidu' // 百度
}
export interface Point {
  lng: number;
  lat: number;
}
export interface CustomPoi {
  poiId: number;
  name: string;
  address: string;
  lng: number;
  lat: number;
  city: string;
  citycode?: number;
  province: string;
  district: string;
}
export interface CustomMap {
  getAddress(point: Point): Promise<CustomPoi[]>;
}
