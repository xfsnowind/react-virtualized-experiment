import React, { useCallback, useRef } from "react";
import type { UIEvent } from "react";
import debounce from "lodash.debounce";
import { getScrollbarWidth } from "./util";
import useWindowDimensions from "./Hooks/useWindowDimensions";
import useScrollItem from "./Hooks/useScrollItem";
import "./App.css";

const data = Array.from({ length: 400 }, (_, row) => {
  return Array.from({ length: 300 }, (_, column) => {
    return [row, column];
  });
});

const cellWidth = 50;
const cellHeight = 50;
const inputWindowWidth = 600;
const inputWindowHeight = 600;

interface DimensionsType {
  offset: number;
  cellDimension: number;
  windowDimension: number;
}

const useIndexForDimensions = ({
  offset,
  cellDimension,
  windowDimension,
}: DimensionsType) => {
  const startIndex = Math.floor(offset / cellDimension);
  const endIndex = Math.ceil((offset + windowDimension) / cellDimension);
  return [startIndex, endIndex];
};

function App() {
  const windowRef = React.useRef<HTMLDivElement>(null);

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [verticalScroll, setVerticalScroll] = React.useState(0);
  const [horizontalScroll, setHorizontalScroll] = React.useState(0);

  const vOffset = useRef(0);
  const hOffset = useRef(0);

  const scrollbarWidth = getScrollbarWidth();

  // set up scroll event to update the offset of top and left
  const onScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const leftOffset = Math.max(0, target.scrollLeft);
    const topOffset = Math.max(0, target.scrollTop);

    vOffset.current = topOffset;
    hOffset.current = leftOffset;

    setVerticalScroll(topOffset);
    setHorizontalScroll(leftOffset);

    debounce(forceUpdate, 160);
  }, []);

  // resizeobserver to update the size of the window
  const [windowWidth, windowHeight] = useWindowDimensions(windowRef);

  // calculate the width of scrollbar

  // calculate the start and end row and column based on the offset
  const [verticalStartIdx, verticalEndIdx] = useIndexForDimensions({
    offset: verticalScroll,
    cellDimension: cellHeight,
    windowDimension: windowHeight,
  });

  const [horizontalStartIdx, horizontalEndIdx] = useIndexForDimensions({
    offset: horizontalScroll,
    cellDimension: cellWidth,
    windowDimension: windowWidth,
  });

  // console.log(
  //   "scroll: ",
  //   verticalScroll,
  //   horizontalScroll,
  //   "vertical: ",
  //   verticalStartIdx,
  //   verticalEndIdx,
  //   "horizontal: ",
  //   horizontalStartIdx,
  //   horizontalEndIdx
  // );

  // render the cells based on the start and end row and column
  const scrollItems = useScrollItem({
    verticalStartIdx,
    verticalEndIdx,
    horizontalStartIdx,
    horizontalEndIdx,
    cellWidth,
    cellHeight,
    data,
  });

  return (
    <div
      style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}
    >
      <div className="App" style={{ width: `${inputWindowWidth}px`, height: `${inputWindowHeight}px` }}>
        <div
          ref={windowRef}
          onScroll={onScroll}
          style={{
            contain: "strict",
            width: "100%",
            height: "100%",
            overflow: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${cellWidth * data[0].length}px`,
              height: `${cellHeight * data.length}px`,
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                left: 0,
                width: `${windowWidth - scrollbarWidth}px`,
                height: `${windowHeight - scrollbarWidth}px`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  transform: `translate(${-hOffset.current}px, ${-vOffset.current}px)`,
                  willChange: "transform",
                  top: 0,
                  left: 0,
                }}
              >
                <div style={{ height: `${cellHeight * verticalStartIdx}px` }} />
                {scrollItems}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
