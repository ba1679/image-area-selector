import { CORNER_CONTROL_SIZE } from "constants";
import { type BoxData, ResizeCorner } from "types";

export const isInResizeCorner = (
  box: BoxData,
  x: number,
  y: number,
): ResizeCorner | null => {
  // Check if the mouse is in a resize corner
  const corners = [
    {
      x: box.x - CORNER_CONTROL_SIZE / 2,
      y: box.y - CORNER_CONTROL_SIZE / 2,
      corner: ResizeCorner.TopLeft,
    },
    {
      x: box.x + box.width - CORNER_CONTROL_SIZE / 2,
      y: box.y - CORNER_CONTROL_SIZE / 2,
      corner: ResizeCorner.TopRight,
    },
    {
      x: box.x - CORNER_CONTROL_SIZE / 2,
      y: box.y + box.height - CORNER_CONTROL_SIZE / 2,
      corner: ResizeCorner.BottomLeft,
    },
    {
      x: box.x + box.width - CORNER_CONTROL_SIZE / 2,
      y: box.y + box.height - CORNER_CONTROL_SIZE / 2,
      corner: ResizeCorner.BottomRight,
    },
  ];

  for (let i = 0; i < corners.length; i++) {
    const { x: cornerX, y: cornerY, corner } = corners[i];
    if (
      x >= cornerX &&
      x <= cornerX + CORNER_CONTROL_SIZE &&
      y >= cornerY &&
      y <= cornerY + CORNER_CONTROL_SIZE
    ) {
      return corner;
    }
  }

  return null;
};

export const checkIsOverlapping = (
  currentIndex: number,
  newBox: BoxData,
  boxes: BoxData[],
) => {
  return boxes.some((box, index) => {
    if (index === currentIndex) return false;

    return !(
      (
        newBox.x > box.x + box.width || // new box on the right side of the old box
        newBox.x + newBox.width < box.x || // new box on the left side of the old box
        newBox.y > box.y + box.height || // new box on the bottom side of the old box
        newBox.y + newBox.height < box.y
      ) // new box on the top side of the old box
    );
  });
};

export const drawControlCorners = (
  ctx: CanvasRenderingContext2D,
  box: BoxData,
) => {
  ctx.fillStyle = box.isOverlapping ? "red" : "#0A6BE3";
  ctx.fillRect(
    box.x - CORNER_CONTROL_SIZE / 2,
    box.y - CORNER_CONTROL_SIZE / 2,
    CORNER_CONTROL_SIZE,
    CORNER_CONTROL_SIZE,
  );
  ctx.fillRect(
    box.x + box.width - CORNER_CONTROL_SIZE / 2,
    box.y - CORNER_CONTROL_SIZE / 2,
    CORNER_CONTROL_SIZE,
    CORNER_CONTROL_SIZE,
  );
  ctx.fillRect(
    box.x - CORNER_CONTROL_SIZE / 2,
    box.y + box.height - CORNER_CONTROL_SIZE / 2,
    CORNER_CONTROL_SIZE,
    CORNER_CONTROL_SIZE,
  );
  ctx.fillRect(
    box.x + box.width - CORNER_CONTROL_SIZE / 2,
    box.y + box.height - CORNER_CONTROL_SIZE / 2,
    CORNER_CONTROL_SIZE,
    CORNER_CONTROL_SIZE,
  );
};

export const limitToBounds = (
  newX: number,
  newY: number,
  rect: DOMRect,
  boxWidth: number,
  boxHeight: number,
) => {
  const minX = rect.left;
  const maxX = rect.right - boxWidth;
  const minY = rect.top;
  const maxY = rect.bottom - boxHeight;

  newX = Math.max(minX, Math.min(newX, maxX));
  newY = Math.max(minY, Math.min(newY, maxY));

  return { newX, newY };
};

export const calculateSelectionBox = (
  startPoint: { x: number; y: number },
  offsetX: number,
  offsetY: number,
  rect: DOMRect,
) => {
  // Ensure the x and y are at the top-left corner
  const newX = Math.min(startPoint.x, offsetX);
  const newY = Math.min(startPoint.y, offsetY);
  let newWidth = Math.abs(offsetX - startPoint.x);
  let newHeight = Math.abs(offsetY - startPoint.y);

  // Limit the box to the canvas boundaries
  const maxX = rect.width;
  const maxY = rect.height;

  if (newX < 0) {
    newWidth = startPoint.x;
  } else if (newX + newWidth > maxX) {
    newWidth = maxX - newX;
  }

  if (newY < 0) {
    newHeight = startPoint.y;
  } else if (newY + newHeight > maxY) {
    newHeight = maxY - newY;
  }

  return {
    x: newX < 0 ? 0 : newX,
    y: newY < 0 ? 0 : newY,
    width: newWidth,
    height: newHeight,
  };
};
