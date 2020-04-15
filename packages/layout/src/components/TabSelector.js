import React, { useState, useContext } from "react";
import { Pane } from "./Pane";
import { View } from "./View";
import { DragContext } from "../contexts/DragContext";
import { useTheme } from "../contexts/ThemeContext";
// const DRAGGING_COLOR = "1px solid rgba(0,0,255, 0.8)";
// const OVERLAY_COLOR = "1px solid rgba(255,0,0, 0.8)";
// const UNOVERLAY_COLOR = "transparent";
export function TabSelector(props) {
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
