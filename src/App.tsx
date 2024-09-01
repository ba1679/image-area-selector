import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";
import UploadImageArea from "./components/UploadImageArea";
import SelectedDataPreview from "./components/SelectedDataPreview";
import emotionNormalize from "emotion-normalize";
import { SelectAreaContext } from "context/SelectAreaContext";
import { useState } from "react";
import { BoxData } from "types";

const StyledContainer = styled("div")({
  display: "flex",
  gap: "135px",
  maxWidth: "1116px",
  margin: "80px auto 0",
});

export function App() {
  const [boxes, setBoxes] = useState<BoxData[]>([]);

  return (
    <>
      <Global
        styles={css`
          ${emotionNormalize},
          p {
            margin: 0;
          }
        `}
      />
      <StyledContainer>
        <SelectAreaContext.Provider value={{ boxes, setBoxes }}>
          <UploadImageArea />
          <SelectedDataPreview />
        </SelectAreaContext.Provider>
      </StyledContainer>
    </>
  );
}
