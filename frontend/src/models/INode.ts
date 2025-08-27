export interface INode {
  id: string | number;
  position: IPosition;
  data: { label: string };
}

export interface IPosition {
  x: number;
  y: number;
}

//{ id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } }
