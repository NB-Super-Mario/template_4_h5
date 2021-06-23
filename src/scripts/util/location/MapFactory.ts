import { MapType, CustomMap } from './CustomMap';
import { GaodeMap } from './GaodeMapImpl';
import { BaiduMap } from './BaiduMapImpl';

export class MapFactory {
  static getEngineInstance(mapType: MapType): CustomMap {
    switch (mapType) {
      case MapType.BAIDU:
        return new BaiduMap();
      default:
        return new GaodeMap();
    }
  }
}
