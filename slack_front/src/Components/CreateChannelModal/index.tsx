import React, { useCallback } from 'react'
import Modal from '../Modal'
import { Label, Input, Button } from '../../pages/SignUp/styles'
import useInput from '../../hooks/useInput';

interface Props {
  children: React.ReactNode
  show: boolean;
  onCloseModal: () => void;
}

const CreateChannelModal = ({show, onCloseModal}: Props) => {
  const [newChannelName, onChangeNewChannelName] = useInput('')
  
  const onCreateChannel = useCallback(() => {
    console.log('채널 만들기')
  }, [])

  if(!show) return null;
  
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id='channel-label'>
          <span>채널 이름</span>
          <Input id='channel' value={newChannelName} onChange={onChangeNewChannelName} />
        </Label>
        <Button type='submit'>생성하기</Button>
      </form>
    </Modal>
  )
}

export default CreateChannelModal