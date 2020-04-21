import React, { useContext, useState, useCallback, useEffect, Suspense, useLayoutEffect } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

const Grid = React.memo(function Grid(props) {
    return (React.createElement("div", { onDragOver: props.onDragOver, style: Object.assign(Object.assign({}, props.style), { display: "grid", width: props.width || "100%", height: props.height || "100%", overflow: "hidden", gridTemplateColumns: props.columns.join(" "), gridTemplateRows: props.rows.join(" "), gridTemplateAreas: props.areas
                .map(row => "'" + row.join(" ") + "'")
                .join(" ") }) }, props.children));
});
const GridArea = React.memo(function GridArea(props) {
    return (React.createElement("div", { style: {
            gridArea: props.name,
            overflow: "auto"
        } }, props.children));
});

function interpose(list, interposer) {
    const r = [];
    list.forEach((i, idx) => {
        r.push(i);
        if (idx !== list.length - 1) {
            r.push(interposer(list[idx], list[idx + 1], idx, idx + 1));
        }
    });
    return r;
}
function pixelToNumber(expr) {
    if (typeof expr === "number") {
        return expr;
    }
    else {
        return Number(expr.replace(/px$/, ""));
    }
}
function fractionToNumber(expr) {
    if (typeof expr === "number") {
        return expr;
    }
    else {
        return Number(expr.replace(/fr$/, ""));
    }
}
function numberToPixel(expr) {
    return `${expr}px`;
}
function numberToFraction(expr) {
    return `${expr}fr`;
}
function exprsToPixels(exprs, maxSize) {
    const pxSum = exprs
        .filter(n => n.includes("px"))
        .map(pixelToNumber)
        .reduce((sum, i) => sum + i, 0);
    const frSum = exprs
        .filter(n => n.includes("fr"))
        .map(fractionToNumber)
        .reduce((sum, i) => sum + i, 0);
    const fractionSize = (maxSize - pxSum) / frSum;
    return exprs
        .map(n => {
        if (n.includes("px")) {
            return pixelToNumber(n);
        }
        else {
            const fr = fractionToNumber(n);
            return fractionSize * fr;
        }
    })
        .map(numberToPixel);
}
function pixelsToFractions(exprs) {
    const values = exprs.map(pixelToNumber);
    const minVal = Math.min(...values);
    const fractionsRates = values.map(v => {
        return Math.floor((v / minVal) * 100) / 100;
    });
    return fractionsRates.map(numberToFraction);
}
function debounce(fn, interval = 16) {
    let timerId;
    return () => {
        clearTimeout(timerId);
        timerId = setTimeout(fn, interval);
    };
}

function buildEditableGridData(original, spacerSize = 16) {
    const controllers = {
        verticals: [],
        horizontals: [],
        crosses: [],
        idxMap: {}
    };
    // build idx to name
    original.areas.forEach((rows, i) => {
        rows.forEach((name, j) => {
            controllers.idxMap[`${i}-${j}`] = name;
        });
    });
    // rebuild rows
    const rows = interpose(original.rows, () => numberToPixel(spacerSize));
    // rebuild columns
    const columns = interpose(original.columns, () => numberToPixel(spacerSize));
    // rebuild areas
    const rowLength = original.areas[0].length;
    const areasRowUpdated = original.areas.map((rows, i) => {
        return interpose(rows, (a, b, j) => {
            if (a === b) {
                return a;
            }
            else {
                const t = `v-${i}-${j}`;
                controllers.verticals.push([i, j]);
                return t;
            }
        });
    });
    // TODO: connect with vertical
    const areas = interpose(areasRowUpdated, (_0, _1, i) => {
        const spaced = new Array(rowLength).fill(0).map((_, j) => {
            if (original.areas[i][j] === original.areas[i + 1][j]) {
                return original.areas[i][j];
            }
            else {
                const t = `h-${i}-${j}`;
                controllers.horizontals.push([i, j]);
                return t;
            }
        });
        return interpose(spaced, (a, _, j) => {
            if (original.areas[i][j] === original.areas[i + 1][j] &&
                original.areas[i][j] === original.areas[i][j + 1] &&
                original.areas[i][j] === original.areas[i + 1][j + 1]) {
                return original.areas[i][j];
            }
            const t = `c-${i}-${j}`;
            controllers.crosses.push([i, j]);
            return t;
        });
    });
    return {
        rows,
        columns,
        fixedColumns: original.fixedColumns,
        fixedRows: original.fixedRows,
        areas,
        controllers
    };
}

const DefaultTheme = {
    uiBaseColor: "#888",
    uiDisabledColor: "#666",
    hoverredTabColor: "red",
    draggingTabColor: "blue",
    draggingColor: "1px solid rgba(0,0,255, 0.8)",
    overlayColor: "1px solid rgba(255,0,0, 0.8)",
    unoverlayColor: "transparent"
};
const ThemeContext = React.createContext(DefaultTheme);
function useTheme() {
    return useContext(ThemeContext);
}

function HitArea(props) {
    const { uiBaseColor, uiDisabledColor } = useTheme();
    // Use rendering context id
    const [uid] = useState(Math.random().toString());
    const [dragging, setDragging] = useState(false);
    const onDragStart = useCallback(ev => {
        setDragging(true);
        props.onDragStart(ev);
    }, [props.onDragStart]);
    const onDragEnd = useCallback(ev => {
        setDragging(false);
        props.onDragEnd(ev);
    }, [props.onDragEnd]);
    return (React.createElement("div", { style: {
            gridArea: props.name,
            width: "100%",
            height: "100%",
            outline: "1px solid white",
            boxSizing: "border-box",
            // pointerEvents: props.disabled ? "none" : undefined,
            backgroundColor: props.disabled ? uiDisabledColor : uiBaseColor
        } },
        React.createElement("style", { dangerouslySetInnerHTML: {
                __html: `.${uid}:active{cursor:grabbing}`
            } }),
        React.createElement("div", { className: uid, onDragStart: onDragStart, onDragEnd: onDragEnd, onDrag: props.onDrag, draggable: !props.disabled, style: {
                cursor: props.disabled ? undefined : "grab",
                opacity: 0,
                width: "100%",
                height: "100%"
            } })));
}

function EditableGrid({ width, height, spacerSize, rows, columns, fixedRows, fixedColumns, areas, showCrossPoint = true, showHorizontal = true, showVertical = true, hideOnResize = false, onChangeGridData, onDragStart, onDragEnd, children }) {
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
    const _a = buildEditableGridData({
        rows: semanticRows,
        fixedRows: original.fixedRows,
        columns: semanticColumns,
        fixedColumns: original.fixedColumns,
        areas: original.areas
    }, spacerSize), { controllers } = _a, editable = __rest(_a, ["controllers"]);
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
        onChangeGridData === null || onChangeGridData === void 0 ? void 0 : onChangeGridData(Object.assign(Object.assign({}, original), { rows,
            columns }));
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

function moveWindowToContainer(layout, fromWindowId, fromContainerId, toWindowId, toContainerId) {
    if (toContainerId === fromContainerId && toWindowId) {
        // replace windows in container
        const newConatiners = layout.panes.map(c => {
            if (c.id !== toContainerId) {
                return c;
            }
            // let selectedId = c.selectedId;
            const newWindowIds = c.windowIds.map(wid => {
                if (wid === fromWindowId) {
                    return toWindowId;
                }
                else if (wid === toWindowId) {
                    return fromWindowId;
                }
                else {
                    return wid;
                }
            });
            return Object.assign(Object.assign({}, c), { windowIds: newWindowIds });
        });
        return Object.assign(Object.assign({}, layout), { panes: newConatiners });
    }
    else {
        // send window to other container
        const newPanes = layout.panes.map(c => {
            let ids = c.windowIds;
            let selectedId = c.selectedId;
            if (c.id === toContainerId) {
                ids = c.windowIds.includes(fromWindowId)
                    ? c.windowIds
                    : [...c.windowIds, fromWindowId];
                selectedId = fromWindowId;
            }
            else {
                ids = c.windowIds.filter(i => i !== fromWindowId);
                if (fromWindowId === c.selectedId) {
                    selectedId = ids[0];
                }
            }
            return Object.assign(Object.assign({}, c), { windowIds: ids, selectedId });
        });
        return Object.assign(Object.assign({}, layout), { panes: newPanes });
    }
}
function selectWindowOnContainer(layout, windowId, containerId) {
    const newPanes = layout.panes.map(c => {
        if (containerId === c.id) {
            return Object.assign(Object.assign({}, c), { selectedId: windowId });
        }
        else {
            return c;
        }
    });
    return Object.assign(Object.assign({}, layout), { panes: newPanes });
}

function Pane(props) {
    const { children, style } = props, other = __rest(props, ["children", "style"]);
    return (React.createElement("div", Object.assign({ style: Object.assign({ alignItems: "center", borderWidth: 0, borderStyle: "solid", boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", margin: 0, minHeight: 0, minWidth: 0, padding: 0, position: "relative", width: "100%", zIndex: 0 }, style) }, other), children));
}

function View(props) {
    const { children, style } = props, other = __rest(props, ["children", "style"]);
    return (React.createElement("div", Object.assign({ style: Object.assign({ alignItems: "stretch", borderWidth: 0, borderStyle: "solid", boxSizing: "border-box", display: "flex", flexDirection: "column", margin: 0, minHeight: 0, minWidth: 0, padding: 0, position: "relative", zIndex: 0 }, style) }, other), children));
}

const DragContext = React.createContext(null);

// const DRAGGING_COLOR = "1px solid rgba(0,0,255, 0.8)";
// const OVERLAY_COLOR = "1px solid rgba(255,0,0, 0.8)";
// const UNOVERLAY_COLOR = "transparent";
function TabSelector(props) {
    const theme = useTheme();
    const [draggingOver, setDraggingOver] = useState(false);
    const drag = useContext(DragContext);
    return (React.createElement(View, { onDragEnter: () => {
            setDraggingOver(true);
        }, onDragLeave: () => {
            setDraggingOver(false);
        }, onDragOver: props.onDragOver, onDragStart: props.onDragStart, onDragEnd: props.onDragEnd, onDrop: ev => {
            props.onDrop && props.onDrop(ev);
            setDraggingOver(false);
        }, style: {
            height: 28,
            alignItems: "left",
            backgroundColor: theme.uiBaseColor,
            boxSizing: "border-box",
            width: "100%",
            flexDirection: "row",
            border: drag && draggingOver ? theme.overlayColor : theme.unoverlayColor
        } }, props.windows.map(window => {
        return (React.createElement(TabButton, { key: window.id, id: window.id, displayName: window.displayName, selected: window.id === props.selectedId, onClick: props.onSelectTab(window.id), onDragEnd: props.onDragEndTab && props.onDragEndTab(window.id), onDragOver: props.onDragOverTab && props.onDragOverTab(window.id), onDragStart: props.onDragStartTab && props.onDragStartTab(window.id), onDrop: props.onDropTab && props.onDropTab(window.id) }, props.renderTab(window)));
    })));
}
function TabButton(props) {
    const [dragging, setDragging] = useState(false);
    const [draggingOver, setDraggingOver] = useState(false);
    const drag = useContext(DragContext);
    const theme = useTheme();
    return (React.createElement(Pane, { draggable: true, onClick: props.onClick, onDragEnter: () => {
            if (drag && drag.windowId !== props.id)
                setDraggingOver(true);
        }, onDragLeave: () => {
            setDraggingOver(false);
        }, onDragStart: ev => {
            props.onDragStart && props.onDragStart(ev);
            setDragging(true);
            ev.stopPropagation();
        }, onDragEnd: ev => {
            props.onDragEnd && props.onDragEnd(ev);
            setDragging(false);
            setDraggingOver(false);
        }, onDrag: props.onDrag, onDragOver: ev => {
            props.onDragOver && props.onDragOver(ev);
        }, onDrop: props.onDrop, style: {
            borderRight: "1px solid rgba(0,0,0,0.4)",
            minWidth: "50px",
            width: 100,
            height: "100%",
            background: props.selected ? "white" : theme.uiBaseColor,
            outline: drag && dragging ? theme.draggingColor : "none",
            border: drag && draggingOver ? theme.overlayColor : theme.unoverlayColor
        } }, props.children));
}

function WindowListContainer({ containerId, windows, selectedId, renderWindow, onSelectTab, onDragStartWindow, onDropWindow, renderTab, showTab }) {
    const dragging = useContext(DragContext);
    const onDragOverTabbar = (ev) => {
        if (dragging) {
            if (dragging.containerId !== containerId) {
                ev.preventDefault();
            }
        }
    };
    const onDragOverTab = (windowId) => (ev) => {
        if (dragging) {
            if (dragging.windowId !== windowId) {
                ev.preventDefault();
            }
        }
    };
    const onDropTabbar = (ev) => {
        onDropWindow(containerId, null)(ev);
    };
    const onDropTab = (windowId) => (ev) => {
        onDropWindow(containerId, windowId)(ev);
    };
    return (React.createElement(Pane, { style: { flexDirection: "column" } },
        showTab && (React.createElement(TabSelector, { windows: windows, renderTab: renderTab, selectedId: selectedId, onDragOver: onDragOverTabbar, onDrop: onDropTabbar, onDropTab: onDropTab, onSelectTab: onSelectTab, onDragStartTab: onDragStartWindow(containerId), onDragOverTab: onDragOverTab })),
        React.createElement(Pane, { style: { flex: 1, background: "white", overflowY: "auto" } }, selectedId && renderWindow(selectedId))));
}

function EditableLayout(props) {
    var _a;
    // State
    const [layout, setLayout] = useState(props.layout);
    const [dragContextValue, setDragContext] = useState(null);
    // Effect
    useEffect(() => {
        props.onChangeLayout && props.onChangeLayout(layout);
    });
    // Handlers
    const onSelectTab = (containerId) => (windowId) => (_ev) => {
        const newLayout = selectWindowOnContainer(layout, windowId, containerId);
        setLayout(newLayout);
    };
    const onDragStartWindow = (containerId) => (windowId) => (ev) => {
        if (ev.dataTransfer) {
            ev.dataTransfer.effectAllowed = "move";
            ev.dataTransfer.setData("text", windowId);
            setDragContext({
                containerId,
                windowId
            });
        }
    };
    const onDropWindow = useCallback((dropContainerId, dropWindowId) => (ev) => {
        ev.stopPropagation(); // stop parent tabbar on drop
        if (dragContextValue) {
            const newLayout = moveWindowToContainer(layout, dragContextValue.windowId, dragContextValue.containerId, dropWindowId, dropContainerId);
            setDragContext(null);
            setLayout(newLayout);
        }
    }, [layout, dragContextValue]);
    const onChangeGridData = useCallback((data) => {
        const newGrid = Object.assign(Object.assign({}, data), { rows: pixelsToFractions(data.rows), columns: pixelsToFractions(data.columns) });
        setLayout(Object.assign(Object.assign({}, layout), { grid: newGrid }));
    }, [layout]);
    return (React.createElement(DragContext.Provider, { value: dragContextValue },
        React.createElement(EditableGrid, Object.assign({ key: `${props.width}-${props.height}`, width: pixelToNumber(props.width), height: pixelToNumber(props.height), spacerSize: (_a = props.spacerSize) !== null && _a !== void 0 ? _a : 8, onChangeGridData: onChangeGridData, onDragStart: props.onDragStart, onDragEnd: props.onDragEnd }, layout.grid), layout.panes.map(pane => {
            var _a;
            const windows = pane.windowIds.map(tid => layout.windows[tid]);
            return (React.createElement(GridArea, { name: pane.id, key: pane.id },
                React.createElement(WindowListContainer, { showTab: (_a = pane.showTab) !== null && _a !== void 0 ? _a : true, containerId: pane.id, windows: windows, renderTab: props.renderTab, selectedId: pane.selectedId || null, onSelectTab: onSelectTab(pane.id), onDragStartWindow: onDragStartWindow, onDropWindow: onDropWindow, renderWindow: (id) => {
                        if (id) {
                            return props.renderWindow(layout.windows[id]);
                        }
                        else {
                            return React.createElement(React.Fragment, null);
                        }
                    } })));
        }))));
}

const DraggingContext = React.createContext(false);
function useDragging() {
    return useContext(DraggingContext);
}
const WindowManagerContext = React.createContext(null);
function useWindowManager() {
    return useContext(WindowManagerContext);
}
function WindowSelector(props) {
    const dragging = useDragging();
    const windowManager = useWindowManager();
    const [age, setAge] = useState(0);
    useEffect(() => {
        const unlisten = windowManager.subscribe(() => {
            setAge(age + 1);
        });
        return () => unlisten();
    }, [age]);
    if (dragging) {
        return (React.createElement("div", { style: {
                outline: "10px solid white",
                boxSizing: "border-box",
                backgroundColor: "#aaa",
                width: "100%",
                height: "100%"
            } }));
    }
    const Current = windowManager.getWindow(props.data.id);
    if (Current) {
        return (React.createElement(Suspense, { fallback: "loading..." },
            React.createElement(Current, { data: props.data })));
    }
    else {
        return (React.createElement("span", null,
            props.data.id,
            ": ",
            props.data.displayName));
    }
}
function LayoutSystem(props) {
    const [dragging, setDragging] = useState(false);
    const onDragStart = useCallback(() => {
        setDragging(true);
    }, []);
    const onDragEnd = useCallback(() => {
        setDragging(false);
    }, []);
    const renderWindow = useCallback((win) => {
        return React.createElement(WindowSelector, { data: win });
    }, []);
    const renderTab = useCallback((data) => {
        return React.createElement("span", null, data.displayName);
    }, []);
    return (React.createElement(WindowManagerContext.Provider, { value: props.windowManager },
        React.createElement(DraggingContext.Provider, { value: dragging },
            React.createElement(EditableLayout, { onChangeLayout: props.onChangeLayout, spacerSize: props.spacerSize, width: props.width, height: props.height, layout: props.initialLayout, onDragStart: onDragStart, onDragEnd: onDragEnd, renderTab: renderTab, renderWindow: renderWindow }))));
}
class WindowManager {
    constructor() {
        this._changeCounter = 0;
        this._listeners = [];
        this._componentMap = new Map();
    }
    subscribe(fn) {
        this._listeners.push(fn);
        return () => {
            this._listeners = this._listeners.filter(f => f !== fn);
        };
    }
    registerWindow(windowId, loader) {
        this._componentMap.set(windowId, loader);
        this._change();
    }
    getWindow(windowId) {
        return this._componentMap.get(windowId);
    }
    _change() {
        this._changeCounter++;
        this._listeners.forEach(f => f());
    }
}

function useWindowSize() {
    const [state, setState] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    useLayoutEffect(() => {
        const onresize = debounce(() => setState({ width: window.innerWidth, height: window.innerHeight }));
        window.addEventListener("resize", onresize);
        return () => window.removeEventListener("resize", onresize);
    }, []);
    return state;
}
function useElementSize(ref) {
    const [state, setState] = useState(null);
    useLayoutEffect(() => {
        if (ref.current && window["ResizeObserver"]) {
            const observer = (entries, _observer) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    setState({ width, height });
                }
            };
            const ro = new ResizeObserver(observer);
            ro.observe(ref.current);
            return () => ro.unobserve(ref.current);
        }
    }, [ref]);
    return state;
}

export { WindowListContainer as Container, EditableGrid, EditableLayout, Grid, GridArea, LayoutSystem, WindowManager, debounce, exprsToPixels, fractionToNumber, interpose, numberToFraction, numberToPixel, pixelToNumber, pixelsToFractions, useDragging, useElementSize, useWindowManager, useWindowSize };
