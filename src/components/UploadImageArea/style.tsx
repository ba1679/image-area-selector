import styled from "@emotion/styled";
import { ContainerControlsProps, PositionProps } from "types/style-props";

export const Container = styled("div")`
  width: 433px;
  height: 792px;
  background-color: #f4f9fa;
  border-radius: 12px;
  overflow: hidden;
`;

export const Header = styled("div")`
  background-color: #ebf0f3;
  padding: 16px 0;
`;

export const StyledCircle = styled("div")`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #d4dade;
  margin-left: 38px;
`;

export const UploadInput = styled("input")`
  display: none;
`;

export const UploadImageContainer = styled("div")<ContainerControlsProps>`
  display: ${(props) => (props.display ? props.display : "flex")};
  cursor: ${(props) => {
    if (props.isDragging) {
      return "grabbing";
    } else if (props.isResizing) {
      return "crosshair";
    } else {
      return "auto";
    }
  }};
  position: relative;
  width: 355px;
  margin: 76px auto 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #dddfe7;
  border-radius: 16px;
  color: #adaeb0;
  background-color: #ffffff;
  overflow: hidden;

  > canvas {
    vertical-align: middle;
  }
`;

export const UploadImageLabel = styled("label")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 156px;
  cursor: pointer;

  > p {
    font-size: 18px;
    font-weight: 500;
    margin-top: 12px;
  }
`;

export const DeleteButton = styled("button")<PositionProps>`
  position: absolute;
  left: ${(props) => `${props.left}px`};
  top: ${(props) => `${props.top}px`};
  display: flex;
  cursor: pointer;
  background-color: #fcfcff;
  border-radius: 8px;
  border: none;
  padding: 8px;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
`;

export const IndexBadge = styled("div")<PositionProps>`
  position: absolute;
  left: ${(props) => `${props.left}px`};
  top: ${(props) => `${props.top}px`};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  color: #000000;
  background-color: #ffffff;
  font-size: 12px;
  opacity: 0.8;
  border-radius: 50%;
  padding: 4px;
`;
