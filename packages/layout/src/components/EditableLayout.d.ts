import React from "react";
import { LayoutData, WindowData } from "../types";
export declare function EditableLayout(props: {
    width: number | string;
    height: number | string;
    layout: LayoutData;
    spacerSize?: number;
    onDragStart?: Function;
    onDragEnd?: Function;
    renderWindow: (data: WindowData) => React.ReactNode;
    renderTab: (data: WindowData) => React.ReactNode;
    onChangeLayout?: (data: LayoutData) => void;
}): JSX.Element;
