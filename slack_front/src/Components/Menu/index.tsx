import React, { CSSProperties, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
  children: React.ReactNode
  style: CSSProperties
  show: boolean;
  onCloseModal: (e: React.MouseEvent<HTMLElement>) => void;
  closeButton?: boolean
}

const Menu = ({children, style, show, onCloseModal, closeButton}: Props) => {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, [])

  if(!show) return null;

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  )
}

Menu.defaultProps = {
  closeButton: true,
}

export default Menu;