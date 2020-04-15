import React from "react";
export const Grid = React.memo(function Grid(props) {
    return (React.createElement("div", { onDragOver: props.onDragOver, style: {
            ...props.style,
            display: "grid",
            width: props.width || "100%",
            height: props.height || "100%",
            overflow: "hidden",
            gridTemplateColumns: props.columns.join(" "),
            gridTemplateRows: props.rows.join(" "),
            gridTemplateAreas: props.areas
                .map(row => "'" + row.join(" ") + "'")
                .join(" ")
        } }, props.children));
});
export const GridArea = React.memo(function GridArea(props) {
    return (React.createElement("div", { style: {
            gridArea: props.name,
            overflow: "auto"
        } }, props.children));
});
