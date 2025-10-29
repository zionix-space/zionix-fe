import styled from "styled-components";
import {
  colors,
  motionCurves,
  revealEffect,
  fluentDropZonePulse,
  warningPulse,
} from "../theme";

// Compact Lowcode-style Drop zone with smooth drag and drop indications
export const DropZone = styled.div`
  flex: 0 0 auto;
  height: 8px; /* More compact for Lowcode design */
  transition: all 0.2s ease;
  border-radius: 4px;
  margin: 6px 0;
  position: relative;
  background: transparent;
  border: 1px dashed transparent;
  pointer-events: auto;

  /* Hide every second drop zone to prevent overcrowding */
  &:nth-of-type(2n) {
    display: none;
  }

  /* Horizontal drag zones (between columns) */
  &.horizontalDrag {
    width: 8px; /* More compact for Lowcode design */
    height: auto;
    min-height: 60px;
    /* margin: 0 6px; */
    border-radius: 4px;
  }

  /* Last drop zone styling */
  &:not(.horizontalDrag).isLast {
    flex: 1 1 auto;
    min-height: 40px;
  }

  /* Lowcode Design hover indication */
  &:hover:not(.active) {
    background: #eff6ff;
    border-color: #d1d5db;

    /* Lowcode reveal effect on hover */
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(59, 130, 246, 0.06) 0%,
        rgba(59, 130, 246, 0.02) 100%
      );
      border-radius: 4px;
      pointer-events: none;
    }
  }

  /* Active state with Lowcode Design motion */
  &.active {
    background: #dbeafe;
    border-color: #3b82f6;
    transition: all 0.15s ease;

    /* Lowcode indicator line */
    background-image: linear-gradient(to right, #3b82f6 0%, #3b82f6 100%);
    background-size: 100% 2px;
    background-position: center;
    background-repeat: no-repeat;

    &.horizontalDrag {
      background-image: linear-gradient(to bottom, #3b82f6 0%, #3b82f6 100%);
      background-size: 2px 100%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  /* Lowcode Design glow effect for active state */
  &.active {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2),
      0 2px 8px rgba(59, 130, 246, 0.15);

    /* Lowcode subtle pulse animation */
    animation: ${fluentDropZonePulse} 2s ease infinite;
  }

  /* Warning state for many columns */
  &.active.warning-many-columns {
    border-color: #faad14; /* Ant Design warning color */
    background: rgba(250, 173, 20, 0.1);
    box-shadow: 0 0 0 2px rgba(250, 173, 20, 0.3),
      0 0 8px rgba(250, 173, 20, 0.2);

    /* Warning pulse animation */
    animation: warningPulse 2s ${motionCurves.decelerate} infinite;

    &::after {
      content: "⚠️";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      z-index: 1;
    }
  }

  /* Container-specific drop zones with unique visual indicators */
  &.tab-content-drop-zone {
    background: rgba(24, 144, 255, 0.05);
    border-color: rgba(24, 144, 255, 0.3);

    &.active {
      background: rgba(24, 144, 255, 0.1);
      border-color: ${colors.primary};
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.3),
        0 0 8px rgba(24, 144, 255, 0.2);
    }
  }

  &.card-content-drop-zone {
    background: rgba(82, 196, 26, 0.05);
    border-color: rgba(82, 196, 26, 0.3);

    &.active {
      background: rgba(82, 196, 26, 0.1);
      border-color: #52c41a;
      box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.3),
        0 0 8px rgba(82, 196, 26, 0.2);
    }
  }

  &.section-content-drop-zone {
    background: rgba(250, 173, 20, 0.05);
    border-color: rgba(250, 173, 20, 0.3);

    &.active {
      background: rgba(250, 173, 20, 0.1);
      border-color: #faad14;
      box-shadow: 0 0 0 2px rgba(250, 173, 20, 0.3),
        0 0 8px rgba(250, 173, 20, 0.2);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    height: 10px;
    margin: 3px 0;

    &.horizontalDrag {
      width: 8px;
      min-height: 50px;
      /* margin: 0 3px; */
    }

    &:not(.horizontalDrag).isLast {
      min-height: 30px;
    }
  }

  /* Microsoft Fluent Design focus ring */
  &:focus {
    outline: 2px solid ${colors.accent};
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Fluent Design accessibility improvements */
  &[aria-label] {
    position: relative;
  }

  /* Smooth entrance animation */
  animation: ${revealEffect} 0.3s ${motionCurves.decelerate};
`;
