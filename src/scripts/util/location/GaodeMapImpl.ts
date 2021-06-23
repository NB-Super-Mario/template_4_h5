import { CustomMap, Point, CustomPoi } from './CustomMap';

declare let AMap: any;

const initGeocoder = () => {
  return new Promise(resolve => {
    AMap.service(['AMap.Geocoder'], _ => {
      const geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      });
      resolve(geocoder);
    });
  });
};
export class GaodeMap implements CustomMap {
  geocoder: any;

  constructor() {
    AMap.service(['AMap.Geocoder'], _ => {
      this.geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      });
    });
  }

  getAddress(point: Point): Promise<CustomPoi[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.geocoder) {
        this.geocoder = await initGeocoder();
      }
      let lnglatXY = new AMap.LngLat(point.lng, point.lat);
      this.geocoder.getAddress(lnglatXY, function(status: string, result: any) {
        if (status === 'complete' && result.info === 'OK') {
          const addrComp = result.regeocode.addressComponent;
          /*var _city = addrComp.city || addrComp.province;
           addrComp.city = self.formatCityname(_city);*/
          const poiList = result.regeocode.pois.map((poi: any) => {
            return {
              poiId: poi.id,
              name: poi.name,
              address: poi.address || poi.name,
              lng: poi.location.lng,
              lat: poi.location.lat,
              city: addrComp.city || addrComp.province,
              citycode: addrComp.citycode,
              province: addrComp.province,
              district: addrComp.district
            };
          });
          resolve(poiList);
        } else {
          reject(null);
        }
      });
    });
  }
}
