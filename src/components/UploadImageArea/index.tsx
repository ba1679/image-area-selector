import {
  type ChangeEvent,
  Fragment,
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { SelectAreaContext } from "context/SelectAreaContext";
import {
  Container,
  Header,
  StyledCircle,
  UploadInput,
  UploadImageContainer,
  UploadImageLabel,
  DeleteButton,
  IndexBadge,
} from "./style";
import { type BoxData } from "types";
import { drawControlCorners } from "utils";
import { useCanvasInteractions } from "hooks/useCanvasInteractions";

export default function UploadImageArea() {
  const { boxes, setBoxes } = useContext(SelectAreaContext);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawSelectedArea = useCallback(
    (boxes: BoxData[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (image) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }

      boxes.forEach((box) => {
        ctx.strokeStyle = box.isOverlapping ? "red" : "#0A6BE3";
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        drawControlCorners(ctx, box);
      });
    },
    [image],
  );

  const {
    isDragging,
    isResizing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasInteractions(boxes, setBoxes, canvasRef, drawSelectedArea);

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const image = new Image();
      if (!e.target?.result || typeof e.target?.result !== "string") return;
      image.src = e.target.result;
      image.onload = () => {
        setImage(image);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          const scale = canvas.width / image.width;
          const targetHeight = image.height * scale;
          canvas.height = targetHeight;
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(image, 0, 0, canvas.width, targetHeight);
        }
      };
    };
  }

  function handleDeleteBox(index: number) {
    const filteredBoxes = boxes.filter((_, i) => i !== index);
    setBoxes(filteredBoxes);
    drawSelectedArea(filteredBoxes);
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);

  return (
    <Container>
      <Header>
        <StyledCircle />
      </Header>
      {!image && (
        <UploadImageContainer>
          <UploadImageLabel htmlFor="upload-image">
            <HiOutlinePhotograph size={32} />
            <p>Upload image</p>
          </UploadImageLabel>
          <UploadInput
            id="upload-image"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </UploadImageContainer>
      )}
      <UploadImageContainer
        display={image ? "block" : "none"}
        isDragging={isDragging.current}
        isResizing={isResizing.current}
      >
        <canvas
          ref={canvasRef}
          width="355"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        />
        {boxes.map((box, index) => (
          <Fragment key={box.id}>
            <IndexBadge left={box.x + 10} top={box.y + 10}>
              {index + 1}
            </IndexBadge>
            <DeleteButton
              left={box.x + box.width + 10}
              top={box.y - 10}
              onClick={() => handleDeleteBox(index)}
            >
              <RiDeleteBinLine color="#AEAEB5" />
            </DeleteButton>
          </Fragment>
        ))}
      </UploadImageContainer>
    </Container>
  );
}
