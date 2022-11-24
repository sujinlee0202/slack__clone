import axios from 'axios';
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import useInput from '../../hooks/useInput';
import { Button, Input, Label } from '../../pages/SignUp/styles';
import { IChannel, IUser } from '../../typings/db';
import fetcher from '../../utils/fetcher';
import Modal from '../Modal';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void
}

const InviteChannelModal = ({ show, onCloseModal, setShowInviteChannelModal }: Props) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('')
  const { workspace, channel } = useParams();

  const { data } = useSWR<IUser>('/api/users', fetcher);
  const { mutate } = useSWR<IChannel[]>(
    data && channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!newMember || !newMember.trim()) return;

    axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
      email: newMember
    })
    .then((response) => {
      console.log('채널 초대 성공')
      setShowInviteChannelModal(false)
      setNewMember('')
      mutate(response.data)
    })
    .catch((error) => console.dir(error))
  }, [newMember, setNewMember, workspace, setShowInviteChannelModal, mutate, channel])
  
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>채널 멤버 초대</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  )
}

export default InviteChannelModal

