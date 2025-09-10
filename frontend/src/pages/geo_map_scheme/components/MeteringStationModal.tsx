import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { AddMeteringStationForm } from "./AddMeteringStationForm";
import {
  CreateMeteringStation,
  GetCounterTypes,
  GetMeteringStationTypes,
  GetPipes,
  setPendingFeature,
  UpdateMeteringStation,
} from "../../../store/reducers/SchemeSlice";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import { AddOrCreateModal } from "./AddOrCreateModal";
import { IMeteringStation } from "../../../models/IMeteringStation";
import { CreateMeteringStationForm } from "./CreateMeteringStationForm";
import { gzuIcon } from "../../../assets";
import { useForm } from "antd/es/form/Form";

interface MeteringStationModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function MeteringStationModal({
  open,
  setOpen,
}: MeteringStationModalProps) {
  const [valueOptions, setValueOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const {
    map,
    pendingFeature,
    meteringStationSource,
    meteringStations,
    selectedSchemeId,
  } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();

  const [formCreate] = useForm();

  useEffect(() => {
    if (!meteringStations) {
      return;
    }
    const filteredWells: IMeteringStation[] = meteringStations.filter(
      (ms) => !ms.latitude && !ms.longitude
    );
    const valueOptions = filteredWells.map((ms) => ({
      value: ms.metering_station_id!,
      label: ms.name,
    }));
    setValueOptions(valueOptions);
    return () => {
      console.log("unmount MeteringStationModal");
      setValueOptions([]);
    };
  }, [meteringStations]);

  useEffect(() => {
    dispatch(GetMeteringStationTypes());
    dispatch(GetCounterTypes());
  }, []);

  function onAdd(selectedId: number | null) {
    if (pendingFeature && map && selectedId && selectedSchemeId) {
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
        UpdateMeteringStation({
          metering_station_id: selectedId,
          latitude,
          longitude,
        })
      );

      dispatch(GetPipes(selectedSchemeId!));

      const meteringStation = meteringStations.find(
        (ps) => ps.metering_station_id === selectedId
      );
      pendingFeature.setProperties({
        ...meteringStation,
        type: "meteringStation",
      });

      setOpen(false);
    }
  }

  function onCreate(meteringStation: IMeteringStation) {
    if (selectedSchemeId && pendingFeature) {
      const geometry = pendingFeature.getGeometry();
      const point = geometry as Point;
      const coordinates = point.getCoordinates();
      const wgs84Coords = transform(
        coordinates,
        map.getView().getProjection(),
        "EPSG:4326"
      );
      meteringStation.latitude = wgs84Coords[0];
      meteringStation.longitude = wgs84Coords[1];

      dispatch(CreateMeteringStation(meteringStation));
      // pendingFeature.setProperties({ name: meteringStation.name });
      pendingFeature.setProperties({
        ...meteringStation,
        type: "meteringStation",
      });
      setOpen(false);
    }
  }

  function OnCancel() {
    setOpen(false);
    if (pendingFeature) {
      meteringStationSource.removeFeature(pendingFeature);
    }
    dispatch(setPendingFeature(null));
    formCreate.resetFields();
  }

  return (
    <>
      <AddOrCreateModal
        title="ГЗУ"
        titleIcon={gzuIcon}
        open={open}
        addDrawForm={
          <AddMeteringStationForm
            meteringStationOptions={valueOptions}
            onAdd={onAdd}
            onCancel={OnCancel}
          />
        }
        createForm={
          <CreateMeteringStationForm
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
