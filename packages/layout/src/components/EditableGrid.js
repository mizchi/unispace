import React, { useState, useCallback } from "react";
import { Grid } from "./Grid";
import { buildEditableGridData } from "../api/grid";
import { exprsToPixels, numberToPixel, pixelToNumber, pixelsToFractions } from "../helpers";
import { HitArea } from "./HitArea";
export function EditableGrid({ width, height, spacerSize, rows, columns, fixedRows, fixedColumns, areas, showCrossPoint = true, showHorizontal = true, showVertical = true, hideOnResize = false, onChangeGridData, onDragStart, onDragEnd, children }) {
    const m = columns.length;
    const n = rows.length;
    const w = pixelToNumber(width) - spacerSize * (m - 1);
    const h = pixelToNumber(height) - spacerSize * (n - 1);
    const original = {
        fixedRows,
        fixedColumns,
        rows: exprsToPixels(rows, h),
        columns: exprsToPixels(columns, w),
        areas
    };
    return (React.createElement(EditableGridInner, { original: original, showVertical: showVertical, showHorizontal: showHorizontal, showCrossPoint: showCrossPoint, hideOnResize: hideOnResize, spacerSize: spacerSize, onChangeGridData: onChangeGridData, onDragStart: onDragStart, onDragEnd: onDragEnd }, children));
}
var HoldingType;
(function (HoldingType) {
    HoldingType["Vertical"] = "v";
    HoldingType["Horizontal"] = "h";
    HoldingType["Center"] = "c";
})(HoldingType || (HoldingType = {}));
function EditableGridInner({ original, children, spacerSize, showCrossPoint, showHorizontal, showVertical, hideOnResize, onDragStart: parentOnDragStart, onDragEnd: parentOnDragEnd, onChangeGridData }) {
    console.log("editable grid inner", original);
    // state
    const [semanticRows, setSemanticRows] = useState(original.rows);
    const [semanticColumns, setSemanticColumns] = useState(original.columns);
    const { controllers, ...editable } = buildEditableGridData({
        rows: semanticRows,
        fixedRows: original.fixedRows,
        columns: semanticColumns,
        fixedColumns: original.fixedColumns,
        areas: original.areas
    }, spacerSize);
    const [holding, setHolding] = useState(null);
    const onDragStartFactory = (type, row, column) => (ev) => {
        ev.dataTransfer.effectAllowed = "move";
        setHolding({
            type,
            row,
            column,
            initialX: ev.pageX,
            initialY: ev.pageY,
            startRows: semanticRows.map(pixelToNumber),
            startColumns: semanticColumns.map(pixelToNumber)
        });
        parentOnDragStart === null || parentOnDragStart === void 0 ? void 0 : parentOnDragStart();
    };
    const onDragEnd = useCallback(() => {
        setHolding(null);
        const rows = pixelsToFractions(semanticRows);
        const columns = pixelsToFractions(semanticColumns);
        onChangeGridData === null || onChangeGridData === void 0 ? void 0 : onChangeGridData({
            ...original,
            rows,
            columns
        });
        // console.log("semantic", semanticRows, semanticColumns);
        parentOnDragEnd === null || parentOnDragEnd === void 0 ? void 0 : parentOnDragEnd();
    }, [original, semanticRows, semanticColumns]);
    const onDrag = useCallback((event) => {
        if (holding) {
            const { type, row: i, column: j, initialX, initialY, startRows: lastRows, startColumns: lastColumns } = holding;
            if (type === HoldingType.Vertical || type === HoldingType.Center) {
                const dx = event.pageX - initialX;
                const leftX = lastColumns[j] + dx;
                const rightX = lastColumns[j + 1] - dx;
                if (leftX > 0 && rightX > 0) {
                    const newColumns = lastColumns
                        .map((val, idx) => {
                        if (idx === j) {
                            return leftX;
                        }
                        else if (idx === j + 1) {
                            return rightX;
                        }
                        else {
                            return val;
                        }
                    })
                        .map(numberToPixel);
                    if (newColumns.join("") !== semanticColumns.join("")) {
                        setSemanticColumns(newColumns);
                    }
                }
            }
            if (type === "h" || type === "c") {
                const dy = event.pageY - initialY;
                const upperX = lastRows[i] + dy;
                const bottomX = lastRows[i + 1] - dy;
                if (upperX > 0 && bottomX > 0) {
                    const newRows = lastRows
                        .map((val, idx) => {
                        if (idx === i) {
                            return upperX;
                        }
                        else if (idx === i + 1) {
                            return bottomX;
                        }
                        else {
                            return val;
                        }
                    })
                        .map(numberToPixel);
                    if (newRows.join("") !== semanticRows.join("")) {
                        setSemanticRows(newRows);
                    }
                }
            }
        }
    }, [holding]);
    const showChildren = hideOnResize && holding;
    return (React.createElement(Grid, Object.assign({}, editable, { style: {
            cursor: holding ? "grabbing" : "auto"
        }, onDragOver: (ev) => {
            holding && ev.preventDefault();
        } }),
        !showChildren && children,
        showVertical &&
            controllers.verticals.map(([row, column]) => {
                const name = `v-${row}-${column}`;
                const disabled = !!(original.fixedColumns && original.fixedColumns[column]);
                return (React.createElement(HitArea, { disabled: disabled, key: name, name: name, onDragStart: onDragStartFactory(HoldingType.Vertical, row, column), onDragEnd: onDragEnd, onDrag: onDrag }));
            }),
        showHorizontal &&
            controllers.horizontals.map(([row, column]) => {
                const name = `h-${row}-${column}`;
                const disabled = !!(original.fixedRows && original.fixedRows[row]);
                return (React.createElement(HitArea, { key: name, name: name, disabled: disabled, onDragStart: onDragStartFactory(HoldingType.Horizontal, row, column), onDragEnd: onDragEnd, onDrag: onDrag }));
            }),
        showCrossPoint &&
            controllers.crosses.map(([row, column]) => {
                const name = `c-${row}-${column}`;
                const vDisabled = !!(original.fixedColumns && original.fixedColumns[column]);
                const hDisabled = !!(original.fixedRows && original.fixedRows[row]);
                return (React.createElement(HitArea, { key: name, name: name, disabled: hDisabled || vDisabled, onDragStart: onDragStartFactory(HoldingType.Center, row, column), onDragEnd: onDragEnd, onDrag: onDrag }));
            })));
}
