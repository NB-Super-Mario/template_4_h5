
import { CustomMap, MapType, Point, CustomPoi } from "./CustomMap";

import { trim } from '..';
declare var BMap: any;

export class BaiduMap implements CustomMap {
  geocoder: any;
  constructor() {
    this.geocoder = new BMap.Geocoder();
  }

  getAddress(point: Point): Promise<CustomPoi[]> {
    return new Promise((resolve, reject) => {
      this.geocoder.getLocation(
        new BMap.Point(point.lng, point.lat), function (result) {
          if (result) {
            var s: CustomPoi[] = [];
            var addrComp = result.addressComponents;
            if (addrComp.city.indexOf('直辖县级行政单位') > -1) {
              addrComp.city = addrComp.district;
            }
            //addComp.city = self.formatCityname(addComp.city);
            var pois = result.surroundingPois;
            for (var i = 0, len = pois.length; i < len; i++) {
              var poi = pois[i];
              s.push({
                poiId: poi.uid,
                name: poi.title,
                address: trim(poi.address) || poi.title,
                lng: poi.point.lng,
                lat: poi.point.lat,
                city: addrComp.city,
                province: addrComp.province,
                district: addrComp.district,
              });
            }
            resolve(s);
          } else {
            reject(null);
          }
        },
        {
          poiRadius: 1000
        });
    });
  }
}