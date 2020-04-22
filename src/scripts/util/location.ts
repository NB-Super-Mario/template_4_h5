import ScriptHelper from './scriptHelper';
import { triggerHandler, registerHandler } from './customEventHandler';

import { MapType, CustomMap, Point, CustomPoi } from './location/CustomMap';
import { MapFactory } from './location/MapFactory';
/**
 *  获取经纬度
 */
/**
 * CustomEvent pollyfill
 */
declare global {
  interface Window {
    mapready: Function;
  }
}

let currentMapType = MapType.GAODE;
let customMap: CustomMap;
export const getLocation = async () =>
  new Promise((resolve, reject) => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat: number = position.coords.latitude;
          const lng: number = position.coords.longitude;
          resolve({
            lng, // 经度
            lat // 纬度
          });
        },
        () => {
          resolve({
            lng: 116.473168,
            lat: 39.993015
          });
          // reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 2000
        }
      );
    } else {
      resolve({
        lng: 116.473168,
        lat: 39.993015
      });
    }
  });

export const getAddress = async (point: Point, cb) => {
  registerHandler({
    protocol: 'mapready',
    callBack: async _ => {
      const customPois: CustomPoi[] = await customMap.getAddress(point);
      cb(customPois);
    }
  });
};

window.mapready = () => {
  customMap = MapFactory.getEngineInstance(currentMapType);
  triggerHandler({
    protocol: 'mapready',
    parameters: {},
    callBack: _ => {}
  });
};
export const initMap = (mapType: MapType) => {
  currentMapType = mapType || MapType.GAODE;
  const scriptUrl =
    mapType === MapType.GAODE
      ? `//webapi.amap.com/maps?v=1.3&key=9485a49f9f98bc7ca669f6327dd591ae&callback=mapready`
      : `https://api.map.baidu.com/api?v=2.0&ak=1bwlHELdsk6YRj52Coif24jlgNVNqjQM&callback=mapready`;

  ScriptHelper.addScript(scriptUrl, mapType);
};
