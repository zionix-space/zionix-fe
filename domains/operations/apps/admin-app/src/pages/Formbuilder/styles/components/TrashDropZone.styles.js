import styled from "styled-components";
import { colors, elevation, motionCurves, fluentTrashPulse } from "../theme";

// Lowcode Design Trash drop zone
export const TrashDropZone = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  text-align: center;
  padding: 16px;
  width: 72px;
  height: 72px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Lowcode subtle backdrop */
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);

  &:before {
    content: "🗑️";
    font-size: 20px;
    transition: all 0.2s ease;
  }

  /* Lowcode Design hover effect */
  &:hover {
    border-color: #ef4444;
    background: #fef2f2;
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.15);

    &:before {
      transform: scale(1.1);
    }
  }

  /* Lowcode Design active state */
  &.active {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
    transform: scale(1.08) translateY(-3px);
    box-shadow: 0 12px 32px rgba(239, 68, 68, 0.25);
    transition: all 0.15s ease;

    /* Lowcode subtle pulse animation */
    animation: ${fluentTrashPulse} 2s ease infinite;

    &:before {
      content: "🗑️";
      filter: brightness(0) invert(1);
      transform: scale(1.2);
    }

    &::after {
      content: "Drop to delete";
      position: absolute;
      bottom: -32px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      color: #ef4444;
      font-weight: 500;
      background: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
      letter-spacing: 0.2px;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    padding: 12px;

    &:before {
      font-size: 18px;
    }

    &.active::after {
      font-size: 10px;
      padding: 4px 8px;
      bottom: -28px;
    }
  }

  /* Microsoft Fluent Design focus ring */
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;
