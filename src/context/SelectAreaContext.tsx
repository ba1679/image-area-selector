import { createContext, type Dispatch, type SetStateAction } from "react";
import { BoxData } from "types";

interface ISelectAreaContext {
  boxes: BoxData[];
  setBoxes: Dispatch<SetStateAction<BoxData[]>>;
}

export const SelectAreaContext = createContext<ISelectAreaContext>({
  boxes: [],
  setBoxes: () => {},
});
