import type React from "react";

/**
 * Creates the style object for a virtual row item
 * This is extracted to avoid creating new objects on every render
 */
export function createVirtualItemStyle(startPosition: number): React.CSSProperties {
  return {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    transform: `translateY(${startPosition}px)`,
  };
}
