import React, { Suspense, useCallback, useContext, useState, useEffect } from "react";
import { EditableLayout } from "./EditableLayout";
const DraggingContext = React.createContext(false);
export function useDragging() {
    return useContext(DraggingContext);
}
const WindowManagerContext = React.createContext(null);
export function useWindowManager() {
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
export function LayoutSystem(props) {
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
export class WindowManager {
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
