export function AddWellDrawForm() {}
// function AddWellDrawForm({
//   selectedSchemeId,
//   wellOptions,
//   selectedWellId,
//   setSelectedWellId,
//   setOpen,
//   pendingFeature,
//   setPendingFeature,
//   wellSource,
//   mapInstance,
// }: {
//   selectedSchemeId: number | null;
//   wellOptions: { value: number | undefined; label: string | undefined }[];
//   selectedWellId: number | null;
//   setSelectedWellId: Dispatch<SetStateAction<number | null>>;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   pendingFeature: DrawEvent | null;
//   setPendingFeature: Dispatch<SetStateAction<DrawEvent | null>>;
//   wellSource: VectorSource;
//   mapInstance: Map;
// }) {
//   const dispatch = useAppDispatch();
//   console.log("Render AddWellDrawForm");

//   const OnAddWell = async () => {
//     if (pendingFeature && mapInstance && selectedWellId) {
//       const geometry = pendingFeature.feature.getGeometry();
//       const point = geometry as Point;
//       const coordinates = point.getCoordinates();
//       const wgs84Coords = transform(
//         coordinates,
//         mapInstance.getView().getProjection(),
//         "EPSG:4326"
//       );
//       var well: Well = {
//         name: "efsefs",
//         well_pump_id: 1,
//         scheme_id: 1,
//         latitude: wgs84Coords[0],
//         longitude: wgs84Coords[1],
//       };
//       //await createWell({ well: well });
//       const latitude = wgs84Coords[0];
//       const longitude = wgs84Coords[1];
//       //console.log("Render AddWellDrawForm");
//       dispatch(UpdateWell({ well_id: selectedWellId, latitude, longitude }));
//       //dispatch(GetWells(selectedSchemeId));
//       setOpen(false);
//       setSelectedWellId(null);
//     }
//   };

//   return (
//     <>
//       <Select
//         style={{ width: "100%" }}
//         options={wellOptions}
//         value={selectedWellId}
//         onChange={(value) => setSelectedWellId(value)}
//       />
//       <Space
//         style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}
//       >
//         <Button
//           onClick={() => {
//             setOpen(false);
//             if (pendingFeature) {
//               wellSource.removeFeature(pendingFeature.feature);
//             }
//             setPendingFeature(null);
//           }}
//         >
//           Отмена
//         </Button>
//         <Button type="primary" onClick={OnAddWell}>
//           Добавить
//         </Button>
//       </Space>
//     </>
//   );
// }
