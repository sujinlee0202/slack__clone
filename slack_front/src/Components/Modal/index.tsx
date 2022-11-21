import React, { useCallback } from 'react'
import { CreateModal } from './styles';
import { CloseModalButton } from './styles'

interface Props {
  show: boolean;
  onCloseModal: () => void;
  children: React.ReactNode
}

const Modal = ({ children, show, onCloseModal}: Props) => {
  const stopPropagation = useCallback((e: React.MouseEvent<Element>) => {
    e.stopPropagation();
  }, [])

  if(!show) return null;

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  )
}

export default Modal