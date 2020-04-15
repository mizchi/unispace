export declare type GridData = {
    fixedColumns?: (string | boolean)[];
    fixedRows?: (string | boolean)[];
    columns: string[];
    rows: string[];
    areas: string[][];
};
export declare type EditbalGridData = GridData & {
    controllers: Controllers;
};
export declare type WindowData = {
    id: string;
    displayName: string;
};
export declare type LayoutData = {
    grid: GridData;
    panes: PaneData[];
    windows: {
        [key: string]: WindowData;
    };
};
export declare type PaneData = {
    id: string;
    displayName?: string;
    selectedId?: string;
    showTab?: boolean;
    windowIds: string[];
};
export declare type Controllers = {
    verticals: [number, number][];
    horizontals: [number, number][];
    crosses: [number, number][];
    idxMap: {
        [key: string]: string;
    };
};
