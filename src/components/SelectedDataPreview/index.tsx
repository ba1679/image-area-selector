import { useContext } from "react";
import { SelectAreaContext } from "context/SelectAreaContext";
import { Container } from "./style";

export default function SelectedDataPreview() {
  const { boxes } = useContext(SelectAreaContext);
  const dimensionData = boxes.map((box) => {
    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    };
  });

  return (
    <Container>
      <pre>{JSON.stringify(dimensionData, null, 2)}</pre>
    </Container>
  );
}
