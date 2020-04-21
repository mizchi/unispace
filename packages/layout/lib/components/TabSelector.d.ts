import { WindowData } from "../types";
import React from "react";
export declare function TabSelector(props: {
    windows: Array<WindowData>;
    selectedId: string | null;
    onSelectTab: (id: string) => (ev: Event) => void;
    onDrop?: (ev: DragEvent) => void;
    onDragOver?: (ev: DragEvent) => void;
    onDragStart?: (ev: DragEvent) => void;
    onDragEnd?: (ev: DragEvent) => void;
    onDragStartTab?: (id: string) => (ev: DragEvent) => void;
    onDragEndTab?: (id: string) => (ev: DragEvent) => void;
    onDragOverTab?: (id: string) => (ev: DragEvent) => void;
    onDropTab?: (id: string) => (ev: DragEvent) => void;
    renderTab: (data: WindowData) => React.ReactNode;
}): JSX.Element;
