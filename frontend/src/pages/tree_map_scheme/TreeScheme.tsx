import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Position,
  useReactFlow,
  Panel,
  ReactFlowProvider,
  ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Divider, Select, Space } from "antd";
import {
  clearSchemeData,
  GetMeteringStations,
  GetPipes,
  GetProductParks,
  GetPumpingStations,
  GetWells,
  schemeSlice,
  setSelectedSchemeId,
} from "../../store/reducers/SchemeSlice";
import { getSchemes } from "../../services/Scheme";
import Dagre from "@dagrejs/dagre";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];
const nodeStyle = {
  width: 80,
};
enum DIRECTION {
  vertical = "BT",
  horizontal = "LR",
}
const nodeSettings = {
  style: { width: 60, height: 25, fontSize: "12px", padding: "4px" },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};
const getNodeSettings = (direct: string) => {
  if (DIRECTION.horizontal === direct) {
    return {
      style: { width: 60, height: 25, fontSize: "12px", padding: "4px" },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  } else {
    // BT (вертикальный)
    return {
      style: { width: 60, height: 25, fontSize: "12px", padding: "4px" },
      sourcePosition: Position.Top,
      targetPosition: Position.Bottom,
    };
  }
};

enum objectTypeForNode {
  Well = "well_",
  MeteringStation = "ms_",
  PumpingStation = "ps_",
  ProductPark = "pp_",
}

type NodeData = {
  label: string;
};

type LayoutNode = Node<NodeData>;

export function TreeScheme() {
  const {
    wells,
    meteringStations,
    pumpingStations,
    productParks,
    pipes,
    selectedSchemeId,
  } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();
  const [nodes, setNodes] = useState<LayoutNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeSelectionIDs, setNodeSelectionIDs] = useState<string[]>([]);
  const [edgeSelectionIDs, setEdgeSelectionIDs] = useState<string[]>([]);
  const [layoutDirection, setLayoutDirection] = useState<DIRECTION>(
    DIRECTION.horizontal
  );

  const onLayout = useCallback(
    (direction: DIRECTION) => {
      console.log(nodes);
      const layouted = getLayoutedElements(nodes, edges, { direction });
      const updatedNodes = layouted.nodes.map((node) => ({
        ...node,
        ...getNodeSettings(direction),
      }));
      setNodes([...updatedNodes]);
      setEdges([...layouted.edges]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  useEffect(() => {
    if (!selectedSchemeId) {
      return;
    }
    setNodes([]);
    setEdges([]);
    dispatch(clearSchemeData());
    dispatch(GetWells(selectedSchemeId!));
    dispatch(GetMeteringStations(selectedSchemeId!));
    dispatch(GetPumpingStations(selectedSchemeId!));
    dispatch(GetProductParks(selectedSchemeId!));
    dispatch(GetPipes(selectedSchemeId!));
  }, [selectedSchemeId]);

  useEffect(() => {
    if (edges.length == 0) {
      return;
    }
    if (!selectedNodeId) {
      setNodeSelectionIDs([]);
      setEdgeSelectionIDs([]);
    }

    const filteredEdges = edges.filter(
      (edge) => edge.source === selectedNodeId || edge.target === selectedNodeId
    );
    const edgeSelectionIDs = filteredEdges.map((edge) => edge.id);
    const nodeSelectionIDs: string[] = [];
    filteredEdges.forEach((edge) => {
      if (edge.source === selectedNodeId) nodeSelectionIDs.push(edge.target);
      if (edge.target === selectedNodeId) nodeSelectionIDs.push(edge.source);
    });
    setNodeSelectionIDs(nodeSelectionIDs);
    setEdgeSelectionIDs(edgeSelectionIDs);
  }, [selectedNodeId, edges]);

  useEffect(() => {
    const wellNodes =
      wells.length > 0
        ? wells.map((well, index) => ({
            id: objectTypeForNode.Well + well.well_id?.toString()!,
            position: { x: 0, y: index * 50 },
            data: { label: well.name },
            ...nodeSettings,
          }))
        : [];
    const meteringStationNodes =
      meteringStations.length > 0
        ? meteringStations.map((ms, index) => ({
            id:
              objectTypeForNode.MeteringStation +
              ms.metering_station_id?.toString()!,
            position: { x: 150, y: index * 50 },
            data: { label: ms.name },
            ...nodeSettings,
          }))
        : [];
    const pumpingStationNodes =
      pumpingStations.length > 0
        ? pumpingStations.map((ps, index) => ({
            id:
              objectTypeForNode.PumpingStation +
              ps.pumping_station_id?.toString()!,
            position: { x: 300, y: index * 50 },
            data: { label: ps.name },
            ...nodeSettings,
          }))
        : [];
    const productParkNodes =
      productParks.length > 0
        ? productParks.map((pp, index) => ({
            id: objectTypeForNode.ProductPark + pp.product_park_id?.toString()!,
            position: { x: 450, y: index * 50 },
            data: { label: pp.name },
            ...nodeSettings,
          }))
        : [];

    function getObjectType(id: number) {
      switch (id) {
        case 1:
          return objectTypeForNode.Well;
        case 2:
          return objectTypeForNode.MeteringStation;
        case 3:
          return objectTypeForNode.PumpingStation;
        case 4:
          return objectTypeForNode.ProductPark;
      }
    }

    const pipeEdges: Edge[] =
      pipes.length > 0
        ? pipes.map((pipe) => ({
            id:
              getObjectType(pipe.start_object_type_id) +
              pipe.start_object_id.toString() +
              "-" +
              getObjectType(pipe.end_object_type_id) +
              pipe.end_object_id.toString(),
            source:
              getObjectType(pipe.start_object_type_id) +
              pipe.start_object_id.toString(),
            target:
              getObjectType(pipe.end_object_type_id) +
              pipe.end_object_id.toString(),
            type: "default",
          }))
        : [];
    console.log([
      ...wellNodes,
      ...meteringStationNodes,
      ...pumpingStationNodes,
      ...productParkNodes,
    ]);
    setNodes([
      ...wellNodes,
      ...meteringStationNodes,
      ...pumpingStationNodes,
      ...productParkNodes,
    ]);

    setEdges(pipeEdges);
  }, [wells, meteringStations, pumpingStations, productParks, pipes]);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const selectedChildStyle = {
    background: "#1677ff",
    color: "#fff",
  };

  const selectedParentStyle = {
    background: "#002140",
    color: "#fff",
  };

  const selectedEdgeStyle = {};

  const nodeWithSelection = nodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      background:
        node.id === selectedNodeId
          ? selectedParentStyle.background
          : nodeSelectionIDs.includes(node.id)
          ? selectedChildStyle.background
          : "",
      color:
        node.id === selectedNodeId
          ? selectedParentStyle.color
          : nodeSelectionIDs.includes(node.id)
          ? selectedChildStyle.color
          : "",
    },
  }));

  const edgeWithSelection = edges.map((edge) => ({
    ...edge,
    style: {
      ...edge.style,
      stroke: edgeSelectionIDs.includes(edge.id) ? "#001529" : "",
    },
    animated: edgeSelectionIDs.includes(edge.id),
    zIndex: edgeSelectionIDs.includes(edge.id) ? 0 : -1,
  }));

  return (
    <>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <ReactFlowProvider>
          <ReactFlow
            fitView
            style={{ width: "100%", height: "100%" }}
            nodes={nodeWithSelection}
            edges={edgeWithSelection}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          />
          <Panel position="top-right">
            <div
              style={{
                top: 10,
                right: 10,
                zIndex: 10,
                width: 250,
              }}
            >
              <MainPanel />
            </div>
            <button onClick={() => onLayout(DIRECTION.vertical)}>
              vertical layout
            </button>
            <button
              onClick={() => {
                onLayout(DIRECTION.horizontal);
              }}
            >
              horizontal layout
            </button>
          </Panel>
        </ReactFlowProvider>
      </div>
    </>
  );
}

//
//Главная панель
//
function MainPanel() {
  const { selectedSchemeId } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();
  const [schemes, setSchemes] = useState<{ value: number; label: string }[]>(
    []
  );

  //Запросы на WebAPI
  useEffect(() => {
    const GetSchemes = async () => {
      const schemes = await getSchemes();
      if (schemes) {
        const schemesOptions = schemes.map((scheme: any) => ({
          value: scheme.scheme_id,
          label: scheme.name,
        }));
        setSchemes(schemesOptions);
        // if (!selectedSchemeId && schemesOptions.length > 0) {
        //   //setSelectedSchemeId(schemesOptions[0].value);
        //   dispatch(setSelectedSchemeId(schemesOptions[0].value));
        // }
      }
    };
    GetSchemes();
  }, []);

  return (
    <>
      <Space style={{ width: "100%", marginLeft: 10, marginRight: 10 }}>
        <Select
          style={{ width: "250px" }}
          placeholder="Выберите схему..."
          value={selectedSchemeId}
          options={schemes}
          onChange={(value, option) => {
            console.log(value);
            dispatch(setSelectedSchemeId(value));
          }}
          dropdownRender={(menu) => (
            <>
              <div style={{ padding: "8px 12px", fontWeight: "bold" }}>
                Схема Сбора
              </div>
              <Divider style={{ margin: "4px 0" }} />
              {menu}
            </>
          )}
        />
      </Space>
    </>
  );
}

const getLayoutedElements = (
  nodes: LayoutNode[],
  edges: Edge[],
  options: any
) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction, ranksep: 30, nodesep: 10 });

  edges.forEach((edge: Edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node: LayoutNode) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node: LayoutNode) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

// import { useState, useCallback, useEffect, useMemo } from "react";
// import {
//   ReactFlow,
//   applyNodeChanges,
//   applyEdgeChanges,
//   addEdge,
//   Node,
//   Edge,
//   Position,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import { useAppSelector } from "../../hooks/redux";

// const initialNodes = [
//   { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
//   { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
// ];
// const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];
// const nodeStyle = {
//   width: 80,
// };
// const nodeSettings = {
//   style: { width: 80 },
//   sourcePosition: Position.Right,
//   targetPosition: Position.Left,
// };

// enum objectTypeForNode {
//   Well = "well_",
//   MeteringStation = "ms_",
//   PumpingStation = "ps_",
//   ProductPark = "pp_",
// }

// export function TreeScheme() {
//   const { wells, meteringStations, pumpingStations, productParks, pipes } =
//     useAppSelector((state) => state.scheme);
//   const [nodes, setNodes] = useState<Node[]>(initialNodes);
//   const [edges, setEdges] = useState<Edge[]>(initialEdges);
//   const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

//   // Get connected node IDs and edge IDs when a node is selected
//   const { connectedNodeIds, connectedEdgeIds } = useMemo(() => {
//     if (!selectedNodeId) return { connectedNodeIds: [], connectedEdgeIds: [] };

//     const connectedEdges = edges.filter(
//       (edge) => edge.source === selectedNodeId || edge.target === selectedNodeId
//     );

//     const connectedNodes = connectedEdges.reduce<string[]>((acc, edge) => {
//       if (edge.source === selectedNodeId) acc.push(edge.target);
//       if (edge.target === selectedNodeId) acc.push(edge.source);
//       return acc;
//     }, []);

//     return {
//       connectedNodeIds: connectedNodes,
//       connectedEdgeIds: connectedEdges.map((edge) => edge.id),
//     };
//   }, [selectedNodeId, edges]);

//   useEffect(() => {
//     const wellNodes: Node[] = wells.map((well, index) => ({
//       id: objectTypeForNode.Well + well.well_id?.toString()!,
//       position: { x: 0, y: index * 50 },
//       data: { label: well.name },
//       ...nodeSettings,
//     }));
//     const meteringStationNodes = meteringStations.map((ms, index) => ({
//       id:
//         objectTypeForNode.MeteringStation + ms.metering_station_id?.toString()!,
//       position: { x: 150, y: index * 50 },
//       data: { label: ms.name },
//       ...nodeSettings,
//     }));
//     const pumpingStationNodes = pumpingStations.map((ps, index) => ({
//       id: objectTypeForNode.PumpingStation + ps.pumping_station_id?.toString()!,
//       position: { x: 300, y: index * 50 },
//       data: { label: ps.name },
//       ...nodeSettings,
//     }));
//     const productParkNodes = productParks.map((pp, index) => ({
//       id: objectTypeForNode.ProductPark + pp.storage_tank_id?.toString()!,
//       position: { x: 450, y: index * 50 },
//       data: { label: pp.name },
//       ...nodeSettings,
//     }));

//     function getObjectType(id: number) {
//       switch (id) {
//         case 1:
//           return objectTypeForNode.Well;
//         case 2:
//           return objectTypeForNode.MeteringStation;
//         case 3:
//           return objectTypeForNode.PumpingStation;
//         case 4:
//           return objectTypeForNode.ProductPark;
//         default:
//           return "";
//       }
//     }

//     const pipeEdges: Edge[] = pipes.map((pipe) => ({
//       id:
//         getObjectType(pipe.start_object_type_id) +
//         pipe.start_object_id.toString() +
//         "-" +
//         getObjectType(pipe.end_object_type_id) +
//         pipe.end_object_id.toString(),
//       source:
//         getObjectType(pipe.start_object_type_id) +
//         pipe.start_object_id.toString(),
//       target:
//         getObjectType(pipe.end_object_type_id) + pipe.end_object_id.toString(),
//       type: "smoothstep",
//     }));

//     setNodes([
//       ...wellNodes,
//       ...meteringStationNodes,
//       ...pumpingStationNodes,
//       ...productParkNodes,
//     ]);

//     setEdges(pipeEdges);
//   }, [wells, meteringStations, pumpingStations, productParks, pipes]);

//   const onNodesChange = useCallback(
//     (changes: any) =>
//       setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
//     []
//   );
//   const onEdgesChange = useCallback(
//     (changes: any) =>
//       setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
//     []
//   );
//   const onConnect = useCallback(
//     (params: any) =>
//       setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
//     []
//   );

//   const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
//     setSelectedNodeId(node.id);
//   }, []);

//   const onPaneClick = useCallback(() => {
//     setSelectedNodeId(null);
//   }, []);

//   // Apply highlighting styles to nodes and edges
//   const nodesWithSelection = nodes.map((node) => ({
//     ...node,
//     style: {
//       ...node.style,
//       backgroundColor:
//         node.id === selectedNodeId
//           ? "#ffd700"
//           : connectedNodeIds.includes(node.id)
//           ? "#fffacd"
//           : undefined,
//       border:
//         node.id === selectedNodeId
//           ? "2px solid #ff8c00"
//           : connectedNodeIds.includes(node.id)
//           ? "2px solid #ffd700"
//           : undefined,
//     },
//   }));

//   const edgesWithSelection = edges.map((edge) => ({
//     ...edge,
//     style: {
//       ...edge.style,
//       stroke:
//         edge.id === selectedNodeId || connectedEdgeIds.includes(edge.id)
//           ? "#000"
//           : undefined,
//       strokeWidth:
//         edge.id === selectedNodeId || connectedEdgeIds.includes(edge.id)
//           ? 3
//           : 2,
//     },
//     animated:
//       edge.id === selectedNodeId || connectedEdgeIds.includes(edge.id)
//         ? true
//         : false,
//     zIndex:
//       edge.id === selectedNodeId || connectedEdgeIds.includes(edge.id) ? 2 : 1,
//   }));

//   return (
//     <ReactFlow
//       nodes={nodesWithSelection}
//       edges={edgesWithSelection}
//       onNodesChange={onNodesChange}
//       onEdgesChange={onEdgesChange}
//       onConnect={onConnect}
//       onNodeClick={onNodeClick}
//       onPaneClick={onPaneClick}
//     />
//   );
// }
