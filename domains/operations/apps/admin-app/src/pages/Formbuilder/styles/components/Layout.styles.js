import styled from "styled-components";
import { colors, elevation, motionCurves } from "../theme";

// Columns container with Lowcode spacing
export const Columns = styled.div`
  display: flex;
  padding: 6px 0;
  gap: 8px;
  min-height: 90px;
  align-items: stretch;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    gap: 6px;
    min-height: 80px;
    padding: 4px 0;
  }
`;

// Column container with Lowcode layout
export const ColumnContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: stretch;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

// Base draggable styling with enterprise design
export const Base = styled.div`
  padding: 16px;
  background-color: ${colors.background};
  cursor: move;
  border-radius: 4px;
  border: 1px solid ${colors.border};
  transition: all 0.15s ${motionCurves.decelerate};
  box-shadow: ${elevation.depth2};

  &:hover {
    border-color: ${colors.borderHover};
    box-shadow: ${elevation.depth4};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Column styling with Lowcode design
export const Column = styled.div`
  background-color: ${colors.background};
  cursor: move;
  border: 1px dashed;
  border-color: rgb(206, 211, 219);
  flex: 1 1 100%;
  padding: 12px;
  margin: 4px;
  min-height: 80px;
  transition: all 0.2s ease;
  position: relative;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;

  /* Lowcode hover effect */
  &:hover:not(.dragging) {
    border: 1px solid;
    border-color: #2563eb;
    background: ${colors.background};
    box-shadow: none;

    &:before {
      opacity: 1;
      color: ${colors.textOnPrimary};
      border-color: #2563eb;
      background: #2563eb;
      font-weight: 500;
    }
  }

  &:active:not(.dragging) {
    transform: scale(0.98);
    transition: all 0.1s ease;
  }

  &.dragging {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    border-color: #2563eb;
    background: ${colors.background};
    transition: none;

    &:before {
      opacity: 1;
      color: ${colors.textOnPrimary};
      border-color: #2563eb;
      background: #2563eb;
      font-weight: 500;
    }
  }

  &:before {
    content: "Column";
    position: absolute;
    top: -8px;
    right: 12px;
    background: ${colors.background};
    padding: 2px 8px;
    font-size: 11px;
    color: ${colors.textSecondary};
    border: 1px solid ${colors.border};
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s ease;
    letter-spacing: 0.2px;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
    opacity: 0;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    padding: 8px;
    min-height: 70px;
    margin: 3px;
  }
`;

// Row styling with Lowcode design
export const Row = styled.div`
  background-color: ${colors.background};
  cursor: move;
  border: 1px dashed;
  border-color: rgb(206, 211, 219);
  border-radius: 6px;
  padding: 12px;
  margin: 6px 0;
  transition: all 0.2s ease;
  position: relative;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;

  /* Visual indicator for rows with many columns */
  &[data-column-count="4"] {
    border-color: #faad14;
    background: linear-gradient(
      135deg,
      ${colors.background} 0%,
      rgba(250, 173, 20, 0.05) 100%
    );

    &::before {
      content: "⚠️ 4 columns";
      position: absolute;
      top: -8px;
      right: 8px;
      background: #faad14;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      z-index: 1;
    }
  }

  &[data-column-count="5"],
  &[data-column-count="6"] {
    border-color: #ff7875;
    background: linear-gradient(
      135deg,
      ${colors.background} 0%,
      rgba(255, 120, 117, 0.05) 100%
    );

    &::before {
      content: "⚠️ " attr(data-column-count) " columns";
      position: absolute;
      top: -8px;
      right: 8px;
      background: #ff7875;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      z-index: 1;
    }
  }

  /* Lowcode hover effect */
  &:hover:not(.dragging) {
    border: 1px solid;
    border-color: #2563eb;
    background: ${colors.background};
    box-shadow: none;

    &:before {
      opacity: 1;
      color: ${colors.textOnPrimary};
      border-color: #2563eb;
      background: #2563eb;
      font-weight: 500;
    }
  }

  &:active:not(.dragging) {
    transform: scale(0.98);
    transition: all 0.1s ease;
  }

  &.dragging {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    border-color: #2563eb;
    background: ${colors.background};
    transition: none;

    &:before {
      opacity: 1;
      color: ${colors.textOnPrimary};
      border-color: #2563eb;
      background: #2563eb;
      font-weight: 500;
    }
  }

  &:before {
    content: "Row";
    position: absolute;
    top: -8px;
    right: 12px;
    background: ${colors.background};
    padding: 2px 8px;
    font-size: 11px;
    color: ${colors.textSecondary};
    border: 1px solid ${colors.border};
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s ease;
    letter-spacing: 0.2px;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
    opacity: 0;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    padding: 8px;
    margin: 4px 0;
  }
`;
