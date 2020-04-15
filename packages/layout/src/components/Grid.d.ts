import React from "react";
export declare type GridProps = {
    columns: string[];
    rows: string[];
    areas: string[][];
    children: any;
    width?: string | number;
    height?: string | number;
    style?: any;
    onDragOver?: any;
};
export declare type GridAreaProps = {
    name: string;
    children: any;
};
export declare const Grid: React.NamedExoticComponent<GridProps>;
export declare const GridArea: React.NamedExoticComponent<GridAreaProps>;
