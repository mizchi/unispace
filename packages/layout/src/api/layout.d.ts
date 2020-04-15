import { LayoutData, PaneData } from "../types";
export declare function moveWindowToContainer(layout: LayoutData, fromWindowId: string, fromContainerId: string, toWindowId: string | null, toContainerId: string): LayoutData;
export declare function selectWindowOnContainer(layout: LayoutData, windowId: string, containerId: String): {
    panes: PaneData[];
    grid: import("../types").GridData;
    windows: {
        [key: string]: import("../types").WindowData;
    };
};
