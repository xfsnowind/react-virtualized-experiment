import { useMemo } from "react";

type ScrollItemType = {
  verticalStartIdx: number;
  verticalEndIdx: number;
  horizontalStartIdx: number;
  horizontalEndIdx: number;
  cellWidth: number;
  cellHeight: number;
  data: any[][];
};

const useScrollItem = ({
  verticalStartIdx,
  verticalEndIdx,
  horizontalStartIdx,
  horizontalEndIdx,
  cellWidth,
  cellHeight,
  data,
}: ScrollItemType) =>
  useMemo(() => {
    console.log(horizontalStartIdx, verticalStartIdx);
    return data.slice(verticalStartIdx, verticalEndIdx).map((row, i) => {
      const rowChildren = row
        .slice(horizontalStartIdx, horizontalEndIdx)
        .map((_, j) => {
          const vIdx = i + verticalStartIdx;
          const hIdx = j + horizontalStartIdx;
          let background = (vIdx + hIdx) % 2 === 1 ? "#f8f8f0" : "white";
          return (
            <div
              key={"row-" + i + "-column-" + j}
              style={{
                background,
                color: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: "0 0 " + cellWidth + "px",
                width: cellWidth + "px",
                height: cellHeight + "px",
              }}
            >
              {vIdx}, {hIdx}
            </div>
          );
        });

      return (
        <div
          key={"row-" + i}
          style={{
            display: "flex",
          }}
        >
          <div style={{ width: `${cellWidth * horizontalStartIdx}px` }}></div>
          {rowChildren}
        </div>
      );
    });
  }, [
    verticalStartIdx,
    verticalEndIdx,
    horizontalStartIdx,
    horizontalEndIdx,
    cellWidth,
    cellHeight,
    data,
  ]);

export default useScrollItem;
