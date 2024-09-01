export interface BoxDimension {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoxData extends BoxDimension {
  isOverlapping: boolean;
}

export enum ResizeCorner {
  TopLeft = 1,
  TopRight = 2,
  BottomLeft = 3,
  BottomRight = 4,
}
