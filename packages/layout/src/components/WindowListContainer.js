import React, { useContext } from "react";
import { TabSelector } from "./TabSelector";
import { DragContext } from "../contexts/DragContext";
import { Pane } from "./Pane";
export function WindowListContainer({ containerId, windows, selectedId, renderWindow, onSelectTab, onDragStartWindow, onDropWindow, renderTab, showTab }) {
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
