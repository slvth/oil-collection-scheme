import { Interaction, Modify, Select, Snap } from "ol/interaction";
import { Vector, Vector as VectorSource } from "ol/source";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { Collection } from "ol";

export function useInteractions() {
  const {
    map,
    wellSource,
    meteringStationSource,
    pumpingStationSource,
    productParkSource,
    pipeSource,
    wells,
  } = useAppSelector((state) => state.scheme);

  const selectInteraction = useRef(new Select());

  useEffect(() => {
    map.getInteractions().forEach((i) => {
      if (i instanceof Select || i instanceof Snap || i instanceof Modify) {
        map.removeInteraction(i);
      }
    });

    const combinedSource: Vector = new VectorSource();

    const updateCombinedSource = () => {
      const features = [
        ...wellSource.getFeatures(),
        ...meteringStationSource.getFeatures(),
        ...pumpingStationSource.getFeatures(),
        ...productParkSource.getFeatures(),
        ...pipeSource.getFeatures(),
      ];
      combinedSource.clear();
      combinedSource.addFeatures(features);
    };

    const sources = [
      wellSource,
      meteringStationSource,
      pumpingStationSource,
      productParkSource,
      pipeSource,
    ];

    sources.forEach((source) => {
      source.on("addfeature", updateCombinedSource);
      //source.on("removefeature", updateCombinedSource);
    });

    updateCombinedSource();

    const collection = new Collection(combinedSource.getFeatures());
    console.log(wellSource);
    console.log(wells);
    console.log(collection);
    //
    selectInteraction.current = new Select({
      features: collection,
    });

    const modify: any = new Modify({
      features: selectInteraction.current.getFeatures(),
    });

    const snap = new Snap({
      source: combinedSource,
      pixelTolerance: 10,
      vertex: true,
      edge: true,
    });

    //map.addInteraction(selectInteraction.current);
    map.addInteraction(modify);
    map.addInteraction(snap);

    return () => {
      // Очистка
      map.removeInteraction(selectInteraction.current);
      map.removeInteraction(modify);
      map.removeInteraction(snap);
      sources.forEach((source) => {
        source.un("addfeature", updateCombinedSource);
        source.un("removefeature", updateCombinedSource);
        source.un("changefeature", updateCombinedSource);
      });
    };
  }, [map, wells]);

  return { selectInteraction };
}

// import { Interaction, Modify, Select, Snap } from "ol/interaction";
// import { Vector as VectorSource } from "ol/source";
// import { useEffect } from "react";
// import { useAppSelector } from "../../../hooks/redux";

// interface InteractionsProp {
//   selectInteraction: React.RefObject<Select>;
// }
// export function useInteractions({ selectInteraction }: InteractionsProp) {
//   const {
//     map,
//     wellSource,
//     meteringStationSource,
//     pumpingStationSource,
//     productParkSource,
//     pipeSource,
//     wells,
//   } = useAppSelector((state) => state.scheme);

//   useEffect(() => {
//     if (selectInteraction.current.getFeatures.length < 0) {
//       return;
//     }
//     console.log("mount useInteractions");

//     const snap: any = new Snap({
//       features: selectInteraction.current.getFeatures(),
//       pixelTolerance: 10,
//     });

//     console.log(wellSource.getFeatures());
//     const wellSnapInteraction: any = new Snap({
//       source: wellSource,
//       pixelTolerance: 10,
//     });

//     const gzuSnapInteraction: any = new Snap({
//       source: meteringStationSource,
//       pixelTolerance: 10,
//     });

//     const dnsSnapInteraction: any = new Snap({
//       source: pumpingStationSource,
//       pixelTolerance: 10,
//     });

//     const productParkSnapInteraction: any = new Snap({
//       source: productParkSource,
//       pixelTolerance: 10,
//     });

//     const pipeSnap: any = new Snap({
//       source: pipeSource,
//       pixelTolerance: 10,
//     });

//     const modifyInteraction: any = new Modify({
//       features: selectInteraction.current.getFeatures(),
//     });

//     map.addInteraction(snap);
//     map.addInteraction(wellSnapInteraction);
//     map.addInteraction(gzuSnapInteraction);
//     map.addInteraction(dnsSnapInteraction);
//     map.addInteraction(productParkSnapInteraction);
//     map.addInteraction(pipeSnap);
//     map.addInteraction(modifyInteraction);

//     return () => {
//       console.log("unmount useInteractions");
//       map.removeInteraction(modifyInteraction);
//       map.removeInteraction(wellSnapInteraction);
//       map.removeInteraction(gzuSnapInteraction);
//       map.removeInteraction(dnsSnapInteraction);
//       map.removeInteraction(productParkSnapInteraction);
//       map.removeInteraction(pipeSnap);
//     };
//   }, [map, wells, selectInteraction.current]);
// }
