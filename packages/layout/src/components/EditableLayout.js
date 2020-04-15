import React, { useEffect, useState, useCallback } from "react";
import * as Layout from "../api/layout";
import { pixelsToFractions, pixelToNumber } from "../helpers";
import { WindowListContainer } from "./WindowListContainer";
import { EditableGrid } from "./EditableGrid";
import { DragContext } from "../contexts/DragContext";
import { GridArea } from "./Grid";
export function EditableLayout(props) {
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
        const newLayout = Layout.selectWindowOnContainer(layout, windowId, containerId);
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
            const newLayout = Layout.moveWindowToContainer(layout, dragContextValue.windowId, dragContextValue.containerId, dropWindowId, dropContainerId);
            setDragContext(null);
            setLayout(newLayout);
        }
    }, [layout, dragContextValue]);
    const onChangeGridData = useCallback((data) => {
        const newGrid = {
            ...data,
            rows: pixelsToFractions(data.rows),
            columns: pixelsToFractions(data.columns)
        };
        setLayout({ ...layout, grid: newGrid });
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
