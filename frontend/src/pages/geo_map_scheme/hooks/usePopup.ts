import { Pixel } from "ol/pixel";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setPopupText } from "../../../store/reducers/SchemeSlice";
import { useEffect } from "react";

export function usePopup() {
  const {
    map,
    wells,
    wellTypes,
    wellPumps,
    meteringStations,
    meteringStationTypes,
    counterTypes,
  } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function displayFeatureInfo(pixel: Pixel) {
      map.forEachFeatureAtPixel(pixel, (feature) => {
        const objectType = feature.get("type");

        if (!feature.get("name")) {
          return;
        }

        switch (objectType) {
          case "well":
            // const wellId = feature.get("well_id");
            // if (!wellId) {
            //   return;
            // }
            // const well = wells.find((well) => well.well_id == wellId);
            // if (!well) {
            //   return;
            // }
            // const wellType = wellTypes.find(
            //   (type) => type.well_type_id == well.well_type_id
            // );
            // const wellPump = wellPumps.find(
            //   (pump) => pump.well_pump_id == well.well_pump_id
            // );

            const wellType = feature.get("drive_type_id")
              ? wellTypes.find(
                  (type) => type.drive_type_id == feature.get("drive_type_id")
                )
              : null;
            const wellPump = feature.get("well_pump_id")
              ? wellPumps.find(
                  (pump) => pump.well_pump_id == feature.get("well_pump_id")
                )
              : null;

            // const wellName = well.name;
            const wellName = feature.get("name");
            const wellTypeName = wellType ? wellType.name : "";
            const wellPumpName = wellPump ? wellPump.name : "";
            const wellWaterCut = feature.get("water_cut");
            const wellFlowRate = feature.get("flow_rate");
            const wellFlowRateOil = feature.get("flow_rate_oil");

            const wellText = [
              { label: "Название", value: wellName },
              { label: "Тип привода", value: wellTypeName },
              { label: "Насос", value: wellPumpName },
              { label: "Обводненность", value: wellWaterCut + " %" },
              { label: "Расход жидкости", value: wellFlowRate + " м³/ч" },
              { label: "Расход нефти", value: wellFlowRateOil + " м³/ч" },
            ];
            dispatch(setPopupText(wellText));
            break;
          case "meteringStation":
            // const meteringStationId = feature.get("metering_station_id");
            // if (!meteringStationId) {
            //   return;
            // }
            // const meteringStation = meteringStations.find(
            //   (ms) => ms.metering_station_id == meteringStationId
            // );
            // if (!meteringStation) {
            //   return;
            // }
            // const meteringStationType = meteringStationTypes.find(
            //   (type) =>
            //     type.metering_station_type_id ==
            //     meteringStation.metering_station_type_id
            // );
            // const counter = counterTypes.find(
            //   (counter) =>
            //     counter.counter_type_id == meteringStation.counter_type_id
            // );

            // const meteringStationName = meteringStation.name;
            const meteringStationType = feature.get("metering_station_type_id")
              ? meteringStationTypes.find(
                  (type) =>
                    type.metering_station_type_id ==
                    feature.get("metering_station_type_id")
                )
              : null;
            const counter = feature.get("counter_type_id")
              ? counterTypes.find(
                  (counter) =>
                    counter.counter_type_id == feature.get("counter_type_id")
                )
              : null;

            // const meteringStationName = meteringStation.name;
            const msName = feature.get("name");
            const msTypeName = meteringStationType
              ? meteringStationType.name
              : "";
            const msCounterName = counter ? counter.name : "";
            const msCycleTime = feature.get("cycle_time");
            const msPressure = feature.get("pressure");
            const msFlowlineCount = feature.get("flowline_count");

            const meteringStationText = [
              { label: "Название", value: msName },
              { label: "Тип ГЗУ", value: msTypeName },
              { label: "Тип счетчика", value: msCounterName },
              { label: "Время цикла", value: msCycleTime + " мин" },
              { label: "Давление", value: msPressure + " МПа" },
              { label: "Кол-во усов", value: msFlowlineCount },
            ];
            dispatch(setPopupText(meteringStationText));
            break;
          case "pumpingStation":
            const pumpingStationName = feature.get("name");
            const pumpingStationPressure = feature.get("pressure_working");
            const pumpingStationTankValue = feature.get("tank_volume");
            const pumpingStationThroughput = feature.get("throughput");
            const pumpingStationPumpPerform = feature.get("pump_performance");

            const pumpingStationText = [
              { label: "Название", value: pumpingStationName },
              {
                label: "Рабочее давление",
                value: pumpingStationPressure + " МПа",
              },
              {
                label: "Емкость резервуара",
                value: pumpingStationTankValue + " м³",
              },
              {
                label: "Пропуск. способ",
                value: pumpingStationThroughput + " м³/сут",
              },
              {
                label: "Производ. насоса",
                value: pumpingStationPumpPerform + " м³/ч",
              },
            ];
            dispatch(setPopupText(pumpingStationText));
            break;

          default:
            const text = [{ label: "Название", value: feature.get("name") }];
            dispatch(setPopupText(text));
            break;
        }
      });
    }

    map.on("pointermove", (event) => {
      if (event.dragging) {
        dispatch(setPopupText([]));
        return;
      }
      if (
        map &&
        wells &&
        wellPumps &&
        wellTypes &&
        meteringStations &&
        meteringStationTypes &&
        counterTypes
      ) {
        displayFeatureInfo(event.pixel);
      }
    });
  }, [map, wells, wellTypes, wellPumps]);
}
