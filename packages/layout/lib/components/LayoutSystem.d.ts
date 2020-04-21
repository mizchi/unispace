import React from "react";
import { LayoutData } from "../types";
export declare function useDragging(): boolean;
export declare function useWindowManager(): WindowManager;
export declare function LayoutSystem(props: {
    width: any;
    height: any;
    windowManager: WindowManager;
    initialLayout: LayoutData;
    spacerSize?: number;
    onChangeLayout?: (newLayout: LayoutData) => void;
}): JSX.Element;
export declare class WindowManager<WindowID = string> {
    private _changeCounter;
    private _listeners;
    subscribe(fn: Function): Function;
    private _componentMap;
    registerWindow(windowId: WindowID, loader: React.LazyExoticComponent<any> | React.FC<any>): void;
    getWindow(windowId: WindowID): React.ComponentClass<any, any> | React.FunctionComponent<any> | undefined;
    private _change;
}
