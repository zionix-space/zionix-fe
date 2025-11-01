import { keyframes } from "styled-components";

// Microsoft Fluent Design motion curves
export const motionCurves = {
  standard: "cubic-bezier(0.8, 0, 0.2, 1)",
  decelerate: "cubic-bezier(0.1, 0.9, 0.2, 1)",
  accelerate: "cubic-bezier(0.9, 0.1, 1, 0.2)",
  linear: "linear",
};

// Fluent Design reveal effect
export const revealEffect = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Microsoft Fluent Design keyframe animation for drop zones
export const fluentDropZonePulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 2px #deecf9, 
                0 0 8px rgba(0, 120, 212, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 3px #deecf9, 
                0 0 12px rgba(0, 120, 212, 0.4);
    transform: scale(1.01);
  }
`;

// Microsoft Fluent Design keyframe animation for trash
export const fluentTrashPulse = keyframes`
  0%, 100% {
    transform: scale(1.1) translateY(-4px);
    box-shadow: 0 9.6px 28.8px rgba(0, 0, 0, 0.12), 0 51.2px 115.2px rgba(0, 0, 0, 0.16);
  }
  50% {
    transform: scale(1.15) translateY(-6px);
    box-shadow: 0 12px 40px rgba(209, 52, 56, 0.4);
  }
`;

// Warning pulse animation for many columns
export const warningPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(250, 173, 20, 0.3),
                0 0 8px rgba(250, 173, 20, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(250, 173, 20, 0.4),
                0 0 12px rgba(250, 173, 20, 0.3);
    transform: scale(1.01);
  }
`;
