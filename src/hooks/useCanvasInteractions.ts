import {
  type MouseEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useRef,
  useState,
  useCallback,
} from "react";
import { BoxData, ResizeCorner } from "types";
import {
  isInResizeCorner,
  checkIsOverlapping,
  limitToBounds,
  calculateSelectionBox,
} from "utils";

export function useCanvasInteractions(
  boxes: BoxData[],
  setBoxes: Dispatch<SetStateAction<BoxData[]>>,
  canvasRef: RefObject<HTMLCanvasElement>,
  drawSelectedArea: (boxes: BoxData[]) => void,
) {
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const isSelecting = useRef(false);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const resizeCorner = useRef<ResizeCorner | null>(null);
  const currentIndex = useRef(0);
  const isMouseDown = useRef(false);

  function handleMouseDown(e: MouseEvent<HTMLCanvasElement>) {
    const { offsetX, offsetY } = e.nativeEvent;
    let foundBoxIndex = -1;
    let foundResizeCorner = null;
    isMouseDown.current = true;

    boxes.forEach((box, index) => {
      const resizeCorner = isInResizeCorner(box, offsetX, offsetY);
      if (resizeCorner) {
        foundResizeCorner = resizeCorner;
        foundBoxIndex = index;
      } else if (
        offsetX >= box.x &&
        offsetX <= box.x + box.width &&
        offsetY >= box.y &&
        offsetY <= box.y + box.height
      ) {
        // Check if the mouse is inside the box
        foundBoxIndex = index;
      }
    });

    if (foundResizeCorner) {
      isResizing.current = true;
      resizeCorner.current = foundResizeCorner;
      currentIndex.current = foundBoxIndex;
      setStartPoint({ x: offsetX, y: offsetY });
    } else if (foundBoxIndex > -1) {
      isDragging.current = true;
      currentIndex.current = foundBoxIndex;
      setStartPoint({
        x: offsetX - boxes[foundBoxIndex].x,
        y: offsetY - boxes[foundBoxIndex].y,
      });
    } else {
      isSelecting.current = true;
      currentIndex.current = boxes.length;
      setStartPoint({ x: offsetX, y: offsetY });
      const newBox = {
        x: offsetX,
        y: offsetY,
        width: 0,
        height: 0,
        isOverlapping: false,
        id: crypto.randomUUID(),
      };
      setBoxes((prevBoxes) => [...prevBoxes, newBox]);
    }
  }

  function handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!isMouseDown.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const { offsetX, offsetY } = e.nativeEvent;
    const newBoxes = [...boxes];
    let currentBox = newBoxes[currentIndex.current];

    if (isSelecting.current) {
      const { x, y, width, height } = calculateSelectionBox(
        startPoint,
        offsetX,
        offsetY,
        rect,
      );

      currentBox = newBoxes[newBoxes.length - 1];
      currentBox.x = x;
      currentBox.y = y;
      currentBox.width = width;
      currentBox.height = height;
    }

    if (isDragging.current) {
      const { newX, newY } = limitToBounds(
        e.clientX - startPoint.x,
        e.clientY - startPoint.y,
        rect,
        currentBox.width,
        currentBox.height,
      );

      currentBox.x = newX - rect.left;
      currentBox.y = newY - rect.top;
    }

    if (isResizing.current) {
      switch (resizeCorner.current) {
        case ResizeCorner.TopLeft:
          currentBox.width += currentBox.x - offsetX;
          currentBox.height += currentBox.y - offsetY;
          currentBox.x = offsetX;
          currentBox.y = offsetY;
          break;
        case ResizeCorner.TopRight:
          currentBox.width = offsetX - currentBox.x;
          currentBox.height += currentBox.y - offsetY;
          currentBox.y = offsetY;
          break;
        case ResizeCorner.BottomLeft:
          currentBox.width += currentBox.x - offsetX;
          currentBox.x = offsetX;
          currentBox.height = offsetY - currentBox.y;
          break;
        case ResizeCorner.BottomRight:
          currentBox.width = offsetX - currentBox.x;
          currentBox.height = offsetY - currentBox.y;
          break;
        default:
          break;
      }

      // Correct width and height, and adjust the starting point
      if (currentBox.width < 0) {
        currentBox.x += currentBox.width;
        currentBox.width = Math.abs(currentBox.width);
      }

      if (currentBox.height < 0) {
        currentBox.y += currentBox.height;
        currentBox.height = Math.abs(currentBox.height);
      }
    }

    currentBox.isOverlapping = checkIsOverlapping(
      currentIndex.current,
      currentBox,
      newBoxes,
    );

    drawSelectedArea(newBoxes);
    setBoxes(newBoxes);
  }

  const handleMouseUp = useCallback(() => {
    isSelecting.current = false;
    isDragging.current = false;
    isResizing.current = false;
    resizeCorner.current = null;
    currentIndex.current = 0;
    isMouseDown.current = false;

    const newBoxes = boxes.filter((box) => !box.isOverlapping);
    drawSelectedArea(newBoxes);
    setBoxes(newBoxes);
  }, [boxes, drawSelectedArea, setBoxes]);

  return {
    startPoint,
    isSelecting,
    isDragging,
    isResizing,
    resizeCorner,
    currentIndex,
    isMouseDown,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
