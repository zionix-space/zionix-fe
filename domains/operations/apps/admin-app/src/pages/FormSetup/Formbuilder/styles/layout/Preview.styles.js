import styled from "styled-components";
import { colors, elevation } from "../theme";

// Preview container with Microsoft Fluent Design
export const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 46px);
  background-color: ${colors.backgroundTertiary};
  overflow: hidden;
  border-radius: 8px;
  box-shadow: ${elevation.depth2};
  margin: 8px;
`;

// Preview header with Microsoft Fluent Design
export const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: ${colors.background};
  border-bottom: 1px solid ${colors.borderLight};
  box-shadow: ${elevation.depth2};
  position: relative;
  z-index: 5;
  border-radius: 8px 8px 0 0;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: ${colors.textPrimary};
    font-family: 'Segoe UI', sans-serif;
  }
`;

// Preview content with Microsoft Fluent Design
export const PreviewContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: ${colors.backgroundTertiary};
  border-radius: 0 0 8px 8px;

  /* Microsoft Fluent Design scrollbar */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.backgroundSecondary};
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.gray60};
    border-radius: 6px;
    border: 2px solid ${colors.backgroundSecondary};

    &:hover {
      background: ${colors.gray80};
    }

    &:active {
      background: ${colors.gray90};
    }
  }

  .ant-form {
    width: 100%;
    margin: 0 auto;
    background: ${colors.background};
    padding: 32px;
    border-radius: 8px;
    box-shadow: ${elevation.depth4};
    border: 1px solid ${colors.borderLight};
  }

  @media (max-width: 768px) {
    padding: 16px;

    .ant-form {
      padding: 24px;
    }
  }
`;
