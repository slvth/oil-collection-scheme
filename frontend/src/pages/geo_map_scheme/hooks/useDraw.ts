import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

import { Draw, Select } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setPendingFeature as setPendingFeatureAction } from "../../../store/reducers/SchemeSlice";

interface DrawProp {
  setWellFormOpen: Dispatch<SetStateAction<boolean>>;
  setOpenMeteringStationForm: Dispatch<SetStateAction<boolean>>;
  setOpenPumpingStationForm: Dispatch<SetStateAction<boolean>>;
  setOpenStorageTankForm: Dispatch<SetStateAction<boolean>>;
  setPendingFeature: Dispatch<SetStateAction<DrawEvent | null>>;
  selectInteraction: React.RefObject<Select>;
}

export function useDraw({
  setWellFormOpen,
  setOpenMeteringStationForm,
  setOpenPumpingStationForm,
  setOpenStorageTankForm,
  setPendingFeature,
  selectInteraction,
}: DrawProp) {
  const {
    map,
    selectedSchemeId,
    pipeSource,
    wellSource,
    meteringStationSource,
    pumpingStationSource,
    productParkSource,
  } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();

  const wellDraw = useRef(new Draw({ source: wellSource, type: "Point" }));
  const gzuDraw = useRef(
    new Draw({ source: meteringStationSource, type: "Point" })
  );
  const dnsDraw = useRef(
    new Draw({ source: pumpingStationSource, type: "Point" })
  );
  const productParkDraw: any = useRef(
    new Draw({ source: productParkSource, type: "Point" })
  );
  const pipeDraw: any = useRef(
    new Draw({
      source: pipeSource,
      type: "LineString",
      stopClick: true,
      freehand: false,
    })
  );

  useEffect(() => {
    if (!selectedSchemeId) {
      return;
    }
    const wellHandler = (e: DrawEvent) => {
      setWellFormOpen(true);
      setPendingFeature(e);
      dispatch(setPendingFeatureAction(e.feature));
      /*
      await onWellDrawEnd({
        map,
        wellSource,
        selectedSchemeId,
        setWellFormOpen,
        e,
      });
      */
    };
    const gzuHandler = async (e: DrawEvent) => {
      setOpenMeteringStationForm(true);
      dispatch(setPendingFeatureAction(e.feature));
      //await onGzuDrawEnd({ map, selectedSchemeId, e });
    };
    const dnsHandler = async (e: DrawEvent) => {
      setOpenPumpingStationForm(true);
      dispatch(setPendingFeatureAction(e.feature));
      //await onDnsDrawEnd({ map, selectedSchemeId, e });
    };
    const productParkHandler = async (e: DrawEvent) => {
      setOpenStorageTankForm(true);
      dispatch(setPendingFeatureAction(e.feature));
      //await onProductParkDrawEnd({ map, selectedSchemeId, e });
    };

    //Скважины
    wellDraw.current.setActive(false);
    map.addInteraction(wellDraw.current);
    wellDraw.current.on("drawend", wellHandler);
    //ГЗУ
    gzuDraw.current.setActive(false);
    map.addInteraction(gzuDraw.current);
    gzuDraw.current.on("drawend", gzuHandler);
    //ДНС
    dnsDraw.current.setActive(false);
    map.addInteraction(dnsDraw.current);
    dnsDraw.current.on("drawend", dnsHandler);
    //Товарный парк
    productParkDraw.current.setActive(false);
    map.addInteraction(productParkDraw.current);
    productParkDraw.current.on("drawend", productParkHandler);
    //Трубы
    pipeDraw.current.setActive(false);
    map.addInteraction(pipeDraw.current);

    return () => {
      wellDraw.current.un("drawend", wellHandler);
      gzuDraw.current.un("drawend", gzuHandler);
      dnsDraw.current.un("drawend", dnsHandler);
      productParkDraw.current.un("drawend", productParkHandler);
    };
  }, [map, selectedSchemeId]);

  return { wellDraw, gzuDraw, dnsDraw, productParkDraw, pipeDraw };
}
