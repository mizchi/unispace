import React from "react";
import { WindowData } from "../types";
export declare function WindowListContainer({ containerId, windows, selectedId, renderWindow, onSelectTab, onDragStartWindow, onDropWindow, renderTab, showTab }: {
    containerId: string;
    windows: WindowData[];
    selectedId: string | null;
    renderWindow: (id: string | null) => React.ReactNode;
    onSelectTab: (windowId: string) => (ev: Event) => void;
    onDragStartWindow: (containerId: string) => (windowId: string) => (ev: DragEvent) => void;
    onDropWindow: (dropContainerId: string, dropWindowId: string | null) => (ev: DragEvent) => void;
    renderTab: (data: WindowData) => React.ReactNode;
    showTab: boolean;
}): JSX.Element;
