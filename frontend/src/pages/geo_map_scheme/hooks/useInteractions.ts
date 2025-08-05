import { Map } from "ol";
import { Modify, Select, Snap } from "ol/interaction";
import { Vector as VectorSource } from "ol/source";
import { useEffect } from "react";

interface InteractionsProp {
  mapInstance: React.RefObject<Map>;
  wellSource: React.RefObject<VectorSource>;
  gzuSource: React.RefObject<VectorSource>;
  dnsSource: React.RefObject<VectorSource>;
  productParkSource: React.RefObject<VectorSource>;
  selectInteraction: React.RefObject<Select>;
}
export function useInteractions({
  mapInstance,
  wellSource,
  gzuSource,
  dnsSource,
  productParkSource,
  selectInteraction,
}: InteractionsProp) {
  useEffect(() => {
    //Modify
    const modifyInteraction: any = new Modify({
      features: selectInteraction.current.getFeatures(),
    });

    //Snapping
    const wellSnapInteraction: any = new Snap({
      source: wellSource.current,
      pixelTolerance: 10,
    });
    const gzuSnapInteraction: any = new Snap({
      source: gzuSource.current,
      pixelTolerance: 10,
    });
    const dnsSnapInteraction: any = new Snap({
      source: dnsSource.current,
      pixelTolerance: 10,
    });
    const productParkSnapInteraction: any = new Snap({
      source: productParkSource.current,
      pixelTolerance: 10,
    });

    mapInstance.current.addInteraction(modifyInteraction);
    mapInstance.current.addInteraction(wellSnapInteraction);
    mapInstance.current.addInteraction(gzuSnapInteraction);
    mapInstance.current.addInteraction(dnsSnapInteraction);
    mapInstance.current.addInteraction(productParkSnapInteraction);
  }, [mapInstance.current]);
}
