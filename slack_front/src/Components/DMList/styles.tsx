import styled from '@emotion/styled';

export const CollapseButton = styled.button<{ collapse: boolean }>`
  background: transparent;

  border-bottom: 8px solid transparent;
  border-left: 12px solid gray;
  border-right: 12px solid transparent;
  border-top: 8px solid transparent;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  padding: 0;

  color: white;
  margin: 0px 0px 0px 10px;
  cursor: pointer;

  ${({ collapse }) =>
    collapse &&
    `
      transform: rotate(90deg);
      margin: 12px 6px 0 4px;
  `};
`;

export const H2 = styled.h2`
  display: flex;
  align-items: center;
`
export const CircleDiv = styled.div<{ isOnline: boolean }>`
  width: 12px;
  height: 12px;
  background-color: #FFF;
  border: 1px solid gray;
  border-radius: 100%;
  margin: 0 4px 0 0;

  ${({ isOnline }) =>
  isOnline &&
  `
    background-color: green;
`};
`;

export const DMMember = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
`;
