import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { IProductPark } from "../../../models/IStorageTank";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import {
  CreateProductPark,
  setPendingFeature,
  UpdateProductPark,
} from "../../../store/reducers/SchemeSlice";
import { AddOrCreateModal } from "./AddOrCreateModal";
import { AddStorageTankForm } from "./AddStorageTankForm";
import { productParkIcon } from "../../../assets";
import { CreateProductParkForm } from "./CreateProductParkForm";
import { useForm } from "antd/es/form/Form";

interface StorageTankModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function StorageTankModal({ open, setOpen }: StorageTankModalProps) {
  const [valueOptions, setValueOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const {
    map,
    pendingFeature,
    productParkSource,
    productParks,
    selectedSchemeId,
  } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();

  const [formCreate] = useForm();

  useEffect(() => {
    if (productParks.length === 0) {
      return;
    }
    const filtered: IProductPark[] = productParks.filter(
      (st: IProductPark) => !st.latitude && !st.longitude
    );
    const valueOptions = filtered.map((st) => ({
      value: st.product_park_id,
      label: st.name,
    }));
    setValueOptions(valueOptions);
  }, [productParks]);

  function onAdd(selectedId: number | null) {
    if (pendingFeature && map && selectedId) {
      const geometry = pendingFeature.getGeometry();
      const point = geometry as Point;
      const coordinates = point.getCoordinates();
      const coordinatesToWgs = transform(
        coordinates,
        map.getView().getProjection(),
        "EPSG:4326"
      );

      const latitude = coordinatesToWgs[0];
      const longitude = coordinatesToWgs[1];

      dispatch(
        UpdateProductPark({
          product_park_id: selectedId,
          latitude,
          longitude,
        })
      );
      setOpen(false);
    }
  }

  function onCreate(productPark: IProductPark) {
    if (selectedSchemeId && pendingFeature) {
      const geometry = pendingFeature.getGeometry();
      const point = geometry as Point;
      const coordinates = point.getCoordinates();
      const wgs84Coords = transform(
        coordinates,
        map.getView().getProjection(),
        "EPSG:4326"
      );
      productPark.latitude = wgs84Coords[0];
      productPark.longitude = wgs84Coords[1];

      dispatch(CreateProductPark(productPark));
      pendingFeature.setProperties({ name: productPark.name });
      setOpen(false);
    }
  }

  function onCancel() {
    setOpen(false);
    if (pendingFeature) {
      productParkSource.removeFeature(pendingFeature);
    }
    dispatch(setPendingFeature(null));
    formCreate.resetFields();
  }

  return (
    <>
      <AddOrCreateModal
        title="Товарный Парк"
        titleIcon={productParkIcon}
        open={open}
        addDrawForm={
          <AddStorageTankForm
            storageTankOptions={valueOptions}
            onAdd={onAdd}
            onCancel={onCancel}
          />
        }
        createForm={
          <CreateProductParkForm
            form={formCreate}
            onCreate={onCreate}
            onCancel={onCancel}
          />
        }
        onCancel={onCancel}
      />
    </>
  );
}
