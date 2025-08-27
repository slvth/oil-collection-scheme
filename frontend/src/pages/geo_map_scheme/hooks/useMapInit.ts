import { useCallback, useEffect, useRef } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import { Select } from "ol/interaction";

import { wellIcon, gzuIcon, dnsIcon, productParkIcon } from "../../../assets";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { schemeSlice } from "../../../store/reducers/SchemeSlice";
import { FeatureLike } from "ol/Feature";
import { Geometry } from "ol/geom";

export function useMapInit() {
  const {
    map,
    pipeSource,
    wellSource,
    meteringStationSource,
    pumpingStationSource,
    productParkSource,
  } = useAppSelector((state) => state.scheme);

  const dispatch = useAppDispatch();
  const animationRef = useRef<number>(null);
  const isMapHaveTarget = useRef(false);

  const selectInteraction = useRef(new Select());

  const textStyle = useCallback(
    (feature: FeatureLike) => {
      if (map.getView().getZoom()! > 12) {
        const name = feature.get("name") ? feature.get("name") : "";
        return new Text({
          offsetY: -25,
          text: [name, "14px sans-serif"],
          fill: new Fill({
            color: "#fff",
          }),
          stroke: new Stroke({
            width: 2,
          }),
        });
      }
    },
    [map]
  );

  const wellStyle = (feature: FeatureLike) => {
    return new Style({
      image: new Icon({
        scale: 0.4,
        size: [100, 100],
        src: wellIcon,
      }),
      text: textStyle(feature),
    });
  };
  const gzuStyle = (feature: FeatureLike) => {
    return new Style({
      image: new Icon({
        scale: 0.4,
        size: [68, 68],
        src: gzuIcon,
      }),
      text: textStyle(feature),
    });
  };
  const dnsStyle = (feature: FeatureLike) => {
    return new Style({
      image: new Icon({
        scale: 0.4,
        size: [100, 100],
        src: dnsIcon,
      }),
      text: textStyle(feature),
    });
  };
  const productParkStyle = (feature: FeatureLike) => {
    return new Style({
      image: new Icon({
        scale: 0.4,
        size: [100, 100],
        src: productParkIcon,
      }),
      text: textStyle(feature),
    });
  };
  const pipeStyle = (feature: FeatureLike) => {
    return new Style({
      stroke: new Stroke({
        color: "#064232ff",
        width: 2,
        lineDash: [1, 5],
      }),
      //text: textStyle(feature),
    });
  };

  useEffect(() => {
    console.log("set");
    dispatch(schemeSlice.actions.setMapTarget("map"));
    map.setTarget("map");
    isMapHaveTarget.current = true;

    const wellLayer = new VectorLayer({
      source: wellSource,
      style: wellStyle,
    });
    const gzuLayer = new VectorLayer({
      source: meteringStationSource,
      style: gzuStyle,
    });
    const dnsLayer = new VectorLayer({
      source: pumpingStationSource,
      style: dnsStyle,
    });
    const productParkLayer = new VectorLayer({
      source: productParkSource,
      style: productParkStyle,
    });
    const pipeLayer = new VectorLayer({
      source: pipeSource,
      style: pipeStyle,
    });

    map.addLayer(pipeLayer);
    map.addLayer(wellLayer);
    map.addLayer(gzuLayer);
    map.addLayer(dnsLayer);
    map.addLayer(productParkLayer);

    // selectInteraction.current = new Select({
    //   layers: map.getAllLayers(),
    // });

    // map.addInteraction(selectInteraction.current);
    // selectInteraction.current.on("select", (feature: any) => {
    //   console.log(feature.selected[0]);
    // });

    let offset = 0;
    const animate = () => {
      offset -= 0.5;
      if (offset <= -20) offset = 0;

      pipeLayer.setStyle(
        new Style({
          stroke: new Stroke({
            color: "#064232ff",
            width: 2,
            lineDash: [10, 10],
            lineDashOffset: offset,
          }),
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      dispatch(schemeSlice.actions.setMapTarget(""));
      map.removeLayer(wellLayer);
      map.removeLayer(gzuLayer);
      map.removeLayer(dnsLayer);
      map.removeLayer(productParkLayer);
      map.removeLayer(pipeLayer);
    };
  }, []);

  return { selectInteraction };
}

// import { useEffect, useRef } from "react";
// import { Vector as VectorLayer } from "ol/layer";
// import { Icon, Stroke, Style } from "ol/style";
// import { Select } from "ol/interaction";

// import { wellIcon, gzuIcon, dnsIcon, productParkIcon } from "../../../assets";
// import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
// import { schemeSlice } from "../../../store/reducers/SchemeSlice";

// export function useMapInit() {
//   const {
//     map,
//     pipeSource,
//     wellSource,
//     meteringStationSource,
//     pumpingStationSource,
//     productParkSource,
//   } = useAppSelector((state) => state.scheme);

//   const dispatch = useAppDispatch();
//   const isMapHaveTarget = useRef(false);

//   const selectInteraction = useRef(new Select());

//   const wellStyle = new Style({
//     image: new Icon({
//       scale: 0.4,
//       size: [100, 100],
//       src: wellIcon,
//     }),
//   });
//   const gzuStyle = new Style({
//     image: new Icon({
//       scale: 0.4,
//       size: [68, 68],
//       src: gzuIcon,
//     }),
//   });
//   const dnsStyle = new Style({
//     image: new Icon({
//       scale: 0.4,
//       size: [100, 100],
//       src: dnsIcon,
//     }),
//   });
//   const productParkStyle = new Style({
//     image: new Icon({
//       scale: 0.4,
//       size: [100, 100],
//       src: productParkIcon,
//     }),
//   });
//   const pipeStyle = new Style({
//     stroke: new Stroke({
//       color: "#333",
//       width: 3,
//     }),
//   });

//   useEffect(() => {
//     if (!isMapHaveTarget.current) {
//       dispatch(schemeSlice.actions.setMapTarget("map"));
//       isMapHaveTarget.current = true;
//     }

//     const wellLayer = new VectorLayer({
//       source: wellSource,
//       style: wellStyle,
//     });
//     const gzuLayer = new VectorLayer({
//       source: meteringStationSource,
//       style: gzuStyle,
//     });
//     const dnsLayer = new VectorLayer({
//       source: pumpingStationSource,
//       style: dnsStyle,
//     });
//     const productParkLayer = new VectorLayer({
//       source: productParkSource,
//       style: productParkStyle,
//     });
//     const pipeLayer = new VectorLayer({
//       source: pipeSource,
//       style: pipeStyle,
//     });

//     map.addLayer(pipeLayer);
//     map.addLayer(wellLayer);
//     map.addLayer(gzuLayer);
//     map.addLayer(dnsLayer);
//     map.addLayer(productParkLayer);

//     selectInteraction.current = new Select({
//       layers: map.getAllLayers(),
//     });

//     map.addInteraction(selectInteraction.current);
//     selectInteraction.current.on("select", (feature: any) => {
//       console.log(feature.selected[0]);
//     });
//   }, []);

//   return { selectInteraction };
// }
