import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  CreatePumpingStation,
  setPendingFeature,
  UpdatePumpingStation,
} from "../../../store/reducers/SchemeSlice";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import { AddOrCreateModal } from "./AddOrCreateModal";
import { IPumpingStation } from "../../../models/IPumpingStation";
import { AddPumpingStationForm } from "./AddPumpingStationForm";
import { CreatePumpingStationForm } from "./CreatePumpingStationForm";
import { dnsIcon } from "../../../assets";
import { useForm } from "antd/es/form/Form";

interface PumpingStationModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function PumpingStationModal({
  open,
  setOpen,
}: PumpingStationModalProps) {
  const [valueOptions, setValueOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const {
    map,
    pendingFeature,
    pumpingStationSource,
    pumpingStations,
    selectedSchemeId,
  } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();

  const [formCreate] = useForm();

  useEffect(() => {
    if (!pumpingStations) {
      return;
    }
    const filtered: IPumpingStation[] = pumpingStations.filter(
      (ps) => !ps.latitude && !ps.longitude
    );
    const valueOptions = filtered.map((ps) => ({
      value: ps.pumping_station_id!,
      label: ps.name,
    }));
    setValueOptions(valueOptions);
    return () => {
      console.log("unmount PumpingStationModal");
      setValueOptions([]);
    };
  }, [pumpingStations]);

  function onAdd(selectedId: number | null) {
    if (pendingFeature && map && selectedId) {
      const geometry = pendingFeature.getGeometry();
      const point = geometry as Point;
      const coordinates = point.getCoordinates();
      const wgs84Coords = transform(
        coordinates,
        map.getView().getProjection(),
        "EPSG:4326"
      );

      const latitude = wgs84Coords[0];
      const longitude = wgs84Coords[1];

      dispatch(
        UpdatePumpingStation({
          pumping_station_id: selectedId,
          latitude,
          longitude,
        })
      );
      setOpen(false);
      //setSelectedId(null);
    }
  }

  function onCreate(pumpingStation: IPumpingStation) {
    if (selectedSchemeId && pendingFeature) {
      const geometry = pendingFeature.getGeometry();
      const point = geometry as Point;
      const coordinates = point.getCoordinates();
      const wgs84Coords = transform(
        coordinates,
        map.getView().getProjection(),
        "EPSG:4326"
      );
      pumpingStation.latitude = wgs84Coords[0];
      pumpingStation.longitude = wgs84Coords[1];

      dispatch(CreatePumpingStation(pumpingStation));
      pendingFeature.setProperties({ name: pumpingStation.name });
      setOpen(false);
    }
  }

  function OnCancel() {
    setOpen(false);
    if (pendingFeature) {
      pumpingStationSource.removeFeature(pendingFeature);
    }
    dispatch(setPendingFeature(null));
    formCreate.resetFields();
  }

  return (
    <>
      <AddOrCreateModal
        title="ДНС"
        titleIcon={dnsIcon}
        open={open}
        addDrawForm={
          <AddPumpingStationForm
            pumpingStationOptions={valueOptions}
            onAdd={onAdd}
            onCancel={OnCancel}
          />
        }
        createForm={
          <CreatePumpingStationForm
            form={formCreate}
            onCreate={onCreate}
            onCancel={OnCancel}
          />
        }
        onCancel={OnCancel}
      />
    </>
  );
}
