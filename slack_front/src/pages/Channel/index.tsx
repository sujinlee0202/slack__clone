import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import ChatBox from "../../Components/ChatBox";
import useInput from "../../hooks/useInput";
import { Container, Header } from "./styles";
import useSWRInfinite from 'swr/infinite'
import fetcher from "../../utils/fetcher";
import { IChannel, IChat, IUser } from "../../typings/db";
import useSocket from "../../hooks/useSocket";
import Scrollbars from "react-custom-scrollbars-2";
import axios from "axios";
import ChatList from "../../Components/ChatList";
import InviteChannelModal from "../../Components/InviteChannelModal";
import makeSection from "../../utils/makeSection";


const Channel = () => {
  const { workspace, channel} = useParams<{workspace: string, channel: string}>();
  const { data: myData } = useSWR(`/api/users`, fetcher)
  const { data: chatData, mutate, setSize } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  ); // 채팅 가져오는 api

  const { data: memberData } = useSWR<IUser[]>(myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null, fetcher)
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher)

  const [socket] = useSocket(workspace)

  const [chat, onChangeChat, setChat] = useInput('');
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false)

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback((e: any) => { // React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
    e.preventDefault();

    if(chat?.trim() && chatData && channelData) { // 채팅이 실제로 존재하면
      const savedChat = chat;
      mutate((prevChatData) => {
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          UserId: myData.id,
          User: myData,
          ChannelId: channelData.id,
          Channel: channelData,
          createdAt: new Date(),
        });
        return prevChatData;
      }, false)
      .then(() => {
        mutate()
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      })
      .catch(console.error)

      // DM 보내는 api
      // ${workspace} : 어떤 워크스페이스의 dms/${id} : 어떤 사람한테 chats : 채팅 보내기
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
        content: chat
      })
      .then(() => {
        mutate()
      })
      .catch(console.error)
    }
  }, [setChat, chat, workspace, mutate, chatData, myData, channelData, channel])

    // DM data 처리
  // API -> dm / 새로운 dm 메시지가 올 때, 서버 데이터 : IDM(dm 데이터)
  const onMessage = useCallback((data: IChat) => {
    // id: 상대방 아이디
    if(data.Channel.name === channel && data.UserId !== myData?.id) {
      mutate((chatData) => {
        chatData?.[0].unshift(data);
        return chatData
      }, false)
      .then(() => {
        if(scrollbarRef.current) {
          if(
            scrollbarRef.current.getScrollHeight() < 
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom', scrollbarRef.current?.getValues())
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom()
            }, 50)
          }
        }
      })
    }
  }, [mutate, myData, channel])

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true)
  }, [])

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false)
  }, [])

  // 변경
  useEffect(() => {
    socket?.on('message', onMessage)
    return () => {
      socket?.off('message', onMessage)
    }
  }, [socket, onMessage])

  // 로딩 시 Scrollbar 제일 아래에 위치
  useEffect(() => {
    if(chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData])

  if(!myData || !myData) {
    return null;
  }

  // 그냥 reverse() 하면 immutable 가 깨진다.
  // chatData가 없는 경우 : []
  // 있는 경우 -> immutable 깨지지 않에 'concat'을 사용한다. 그냥 전개연산자 써도 좋아
  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []) 

  return (
    <Container>
      <Header>
        {/* 변경 */}
        <span>#{channel}</span>
        <div style={{display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          <span>{memberData?.length}</span> {/* 채널에 몇명 들어가있는지 표시 */}
          <button
            onClick={onClickInviteChannel}
          > {/* 채널에 사람 추가 */}
            +
          </button> 
        </div>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
      <InviteChannelModal 
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>
  )
}

export default Channel