import styled from "styled-components";
import { colors } from "../theme";

// Page container wrapper with Lowcode Design
export const PageContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #f8fafc;
  height: calc(100vh - 46px);
  overflow: hidden;
  position: relative;
`;

// Main page container with Lowcode-style compact spacing
export const Page = styled.div`
  flex: 1 1 auto;
  padding: 12px;
  margin: 0;
  background-color: #f8fafc;
  overflow-y: auto;
  height: calc(100vh - 146px);

  /* Lowcode-style scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    &:hover {
      background: #94a3b8;
    }

    &:active {
      background: #64748b;
    }
  }

  /* Responsive padding */
  @media (max-width: 768px) {
    padding: 8px;
  }
`;
