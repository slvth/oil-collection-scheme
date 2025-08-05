import { useEffect, useRef } from "react";

import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control/defaults";
import { Icon, Stroke, Style } from "ol/style";
import { Select } from "ol/interaction";

import { wellIcon, gzuIcon, dnsIcon, productParkIcon } from "../../../assets";

export function useMapInit() {
  //Map
  const osmLayer = new TileLayer({ source: new OSM() });
  const view = new View({
    center: fromLonLat([53.0422314905577, 54.84390266665241]),
    zoom: 13.5,
  });
  const mapInstance: any = useRef(null);

  //Source
  const wellSource = useRef(new VectorSource());
  const gzuSource = useRef(new VectorSource());
  const dnsSource = useRef(new VectorSource());
  const productParkSource = useRef(new VectorSource());
  const pipeSource = useRef(new VectorSource());

  //Style
  const wellStyle = new Style({
    image: new Icon({
      scale: 0.4,
      size: [100, 100],
      src: wellIcon,
    }),
  });
  const gzuStyle = new Style({
    image: new Icon({
      scale: 0.4,
      size: [68, 68],
      src: gzuIcon,
    }),
  });
  const dnsStyle = new Style({
    image: new Icon({
      scale: 0.4,
      size: [100, 100],
      src: dnsIcon,
    }),
  });
  const productParkStyle = new Style({
    image: new Icon({
      scale: 0.4,
      size: [100, 100],
      src: productParkIcon,
    }),
  });
  const pipeStyle = new Style({
    stroke: new Stroke({
      color: "#333",
      width: 3,
    }),
  });

  const selectInteraction = useRef(new Select());

  useEffect(() => {
    const wellLayer = new VectorLayer({
      source: wellSource.current,
      style: wellStyle,
    });
    const gzuLayer = new VectorLayer({
      source: gzuSource.current,
      style: gzuStyle,
    });
    const dnsLayer = new VectorLayer({
      source: dnsSource.current,
      style: dnsStyle,
    });
    const productParkLayer = new VectorLayer({
      source: productParkSource.current,
      style: productParkStyle,
    });
    const pipeLayer = new VectorLayer({
      source: pipeSource.current,
      style: pipeStyle,
    });

    mapInstance.current = new Map({
      target: "map",
      layers: [osmLayer],
      view: view,
      controls: defaultControls({ attribution: false }),
    });

    mapInstance.current.addLayer(pipeLayer);
    mapInstance.current.addLayer(wellLayer);
    mapInstance.current.addLayer(gzuLayer);
    mapInstance.current.addLayer(dnsLayer);
    mapInstance.current.addLayer(productParkLayer);

    selectInteraction.current = new Select({
      layers: [wellLayer, gzuLayer, dnsLayer, productParkLayer, pipeLayer],
    });

    mapInstance.current.addInteraction(selectInteraction.current);
    selectInteraction.current.on("select", (feature: any) => {
      console.log(feature.selected[0]);
    });
  }, []);

  return {
    mapInstance,
    wellSource,
    gzuSource,
    dnsSource,
    productParkSource,
    pipeSource,
    selectInteraction,
  };
}
