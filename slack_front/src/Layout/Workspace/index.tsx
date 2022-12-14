import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, Link } from "react-router-dom";
import useSWR from "swr";
import fetcher from '../../utils/fetcher'
import { Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, Workspaces, WorkspaceWrapper, ProfileModal, LogOutButton, WorkspaceButton, AddButton, WorkspaceModal } from "./styles";
import gravatar from 'gravatar'
import Channel from "../../pages/Channel";
import DirectMessage from "../../pages/DirectMessage";
import Menu from "../../Components/Menu";
import Modal from "../../Components/Modal";
import { Label, Button, Input } from "../../pages/SignUp/styles";
import useInput from "../../hooks/useInput";
import { toast } from 'react-toastify'
import CreateChannelModal from "../../Components/CreateChannelModal";
import { IChannel } from '../../typings/db'
import { useParams } from "react-router-dom";
import InviteWorkspaceModal from "../../Components/InviteWorkspaceModal";
import InviteChannelModal from "../../Components/InviteChannelModal";
import ChannelList from "../../Components/ChannelList";
import DMList from "../../Components/DMList";
import useSocket from "../../hooks/useSocket";

const Workspace = () => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher)
  const { workspace } = useParams() // <{workspace: string}>
  const { data: channelData } = useSWR<IChannel[]>(data ? `/api/workspaces/${workspace}/channels`: null, fetcher)
  
  const [showMenu, setShowMenu] = useState(false)
  const [createWorkspaceModal, setCreateWorkspaceModal] = useState(false)
  const [newWorkspaceName, onChangeNewWorkspacName, setNewWorkspaceName] = useInput('')
  const [newWorkspaceURL, onChangeNewWorkspaceURL, setNewWorkspaceURL] = useInput('')
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [createChannelModal, setCreateChannelModal] = useState(false)
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false)
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false)

  const [socket, disconnect] = useSocket(workspace);

  // Socket ????????????
  useEffect(() => {
    if(channelData && data && socket) {
      console.log(socket)
      socket.emit('login', {
        id: data.id,
        channels: channelData.map((v) => v.id)
      })
    }
  }, [channelData, data, socket])

  // Socket ?????? ??????
  useEffect(() => {
    return () => {
      disconnect();
    }
  }, [workspace, disconnect])

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true
    })
    .then(() => {
      console.log('???????????? ??????!')
      mutate();
    })
  }, [mutate])

  const onClickProfileMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    console.log('????????? ??????!')
    setShowMenu((prev) => !prev)
  }, [])

  const onCloseProfileMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setShowMenu(false)
  }, [])

  const onClickCreateWorkspace = useCallback(() => {
    console.log('click!')
    setCreateWorkspaceModal(true)
  }, [])

  const onCloseModal = useCallback(() => {
    setCreateWorkspaceModal(false);
    setCreateChannelModal(false)
  }, [])

  const onCreateWorkspace = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!newWorkspaceName || !newWorkspaceName.trim()) return;
    if(!newWorkspaceURL || !newWorkspaceURL.trim()) return;
    axios.post('http://localhost:3095/api/workspaces', {
      workspace: newWorkspaceName,
      url: newWorkspaceURL
    },{
      withCredentials: true,
    })
    .then(() => {
      mutate()
      setCreateWorkspaceModal(false)
      setNewWorkspaceName('')
      setNewWorkspaceURL('')
    })
    .catch((error) => {
      toast.error(error.response?.data, { position: 'bottom-center'})
    })
  }, [newWorkspaceName, newWorkspaceURL, mutate, setNewWorkspaceName, setNewWorkspaceURL])

  const toggleWorkspaceModal = useCallback(() => {
    console.log('toggleWorkspaceModal')
    setShowWorkspaceModal((prev) => !prev)
  }, [])

  const onClickAddChannel = useCallback(() => {
    console.log('?????? ?????????')
    setCreateChannelModal(true)
  }, [])

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, [])

  if(!data) {
    return <Navigate to='/login' />
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickProfileMenu}>
            <ProfileImg 
              src={gravatar.url(data.email, {s: '28px', d: 'retro'})} 
              alt={data.nickname}>
            </ProfileImg>
            {showMenu && (
              <Menu 
                style={{right: 0, top: 38}} 
                show={showMenu}
                onCloseModal={onCloseProfileMenu}>
                <ProfileModal>
                  <img 
                    src={gravatar.url(data.email, { s: '28px', d: 'retro'})}
                    alt={data.nickname}
                  ></img>
                  <div>
                    <span id='profile-name'>{data.nickname}</span>
                    <span id='profile-active'>Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>????????????</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>

      <WorkspaceWrapper>
        <Workspaces>
          {data.Workspaces.map((ws: any) => {
            return (
              <Link key={ws.id} to={`/workspace/${workspace}/channel/??????`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            )
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top: 95, left: 80}}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>????????????????????? ????????? ????????????</button>
                <button onClick={onClickAddChannel}>?????? ?????????</button>
                <button onClick={onLogout}>????????????</button>
              </WorkspaceModal>
            </Menu>
            {/* {channelData?.map((v) => <div key={v.id}>{v.name}</div>)} */}
            <ChannelList></ChannelList>
            <DMList></DMList>
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path='channel/:channel' element={<Channel />} />
            <Route path='dm/:id' element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>

      <Modal show={createWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id='workspace-label'>
            <span>?????????????????? ??????</span>
            <Input id='workspace' value={newWorkspaceName} onChange={onChangeNewWorkspacName} />
          </Label>
          <Label id='workspace-url-label'>
            <span>?????????????????? URL</span>
            <Input id='workspace' value={newWorkspaceURL} onChange={onChangeNewWorkspaceURL} />
          </Label>
          <Button type='submit'>????????????</Button>
        </form>
      </Modal>

      <CreateChannelModal 
        show={createChannelModal} 
        onCloseModal={onCloseModal}
        setCreateChannelModal={setCreateChannelModal}
        setShowWorkspaceModal={setShowWorkspaceModal}
      >
      </CreateChannelModal>

      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />

      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />

    </div>
  )
}

export default Workspace