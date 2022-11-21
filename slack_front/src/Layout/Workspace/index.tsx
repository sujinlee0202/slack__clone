import axios from "axios";
import React, { useCallback, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useSWR from "swr";
import fetcher from '../../utils/fetcher'
import { Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, Workspaces, WorkspaceWrapper, ProfileModal, LogOutButton } from "./styles";
import gravatar from 'gravatar'
import Channel from "../../pages/Channel";
import DirectMessage from "../../pages/DirectMessage";
import Menu from "../../Components/Menu";

const Workspace = () => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher)
  const [showMenu, setShowMenu] = useState(false)
  
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true
    })
    .then(() => {
      console.log('로그아웃 성공!')
      mutate();
    })
  }, [mutate])

  const onClickProfileMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    console.log('프로필 선택!')
    setShowMenu((prev) => !prev)
  }, [])

  const onCloseProfileMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setShowMenu(false)
  }, [])

  if(!data) {
    return <Navigate to='/login' />
  }

  return (
    <div>
      <Header> Header
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
                    src={gravatar.url(data.nickname, { s: '28px', d: 'retro'})}
                    alt={data.nickname}
                  ></img>
                  <div>
                    <span id='profile-name'>{data.nickname}</span>
                    <span id='profile-active'>Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>Workspaces</Workspaces>
        <Channels>Channels
          <WorkspaceName>Workspace Name</WorkspaceName>
          <MenuScroll>Menu Scroll</MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path='channel' element={<Channel />} />
            <Route path='dm' element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
    </div>
  )
}

export default Workspace