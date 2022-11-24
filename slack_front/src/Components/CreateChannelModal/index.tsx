import React, { useCallback } from 'react'
import Modal from '../Modal'
import { Label, Input, Button } from '../../pages/SignUp/styles'
import useInput from '../../hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import fetcher from '../../utils/fetcher'
import { IUser, IChannel} from '../../typings/db'
import useSWR from 'swr'

interface Props {
  children: React.ReactNode
  show: boolean;
  onCloseModal: () => void;
  setCreateChannelModal: (flag: boolean) => void;
  setShowWorkspaceModal: (flag: boolean) => void;
}

const CreateChannelModal = ({show, onCloseModal, setCreateChannelModal, setShowWorkspaceModal}: Props) => {
  const [newChannelName, onChangeNewChannelName, setNewChannelName] = useInput('')
  const { workspace } = useParams() // <workspace: string>
  
  const { data } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher)
  const { mutate: channelMutate } = useSWR<IChannel[]>(data ? `/api/workspaces/${workspace}/channels`: null, fetcher)

  const onCreateChannel = useCallback((e: React.FormEvent<HTMLFormElement> ) => {
    console.log('채널 만들기 성공')
    e.preventDefault();
    axios.post(`/api/workspaces/${workspace}/channels`, {
      name: newChannelName
    },{
      withCredentials: true
    })
    .then(() => {
      setCreateChannelModal(false)
      setShowWorkspaceModal(false)
      setNewChannelName('')
      channelMutate()
    })
    .catch((error) => 
      console.dir(error)
    )
  }, [newChannelName, channelMutate, setCreateChannelModal, setShowWorkspaceModal, setNewChannelName, workspace])

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