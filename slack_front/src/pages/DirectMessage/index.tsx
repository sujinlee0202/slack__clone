import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, DragOver, Header } from "./styles";
import gravatar from 'gravatar'
import ChatBox from "../../Components/ChatBox";
import ChatList from "../../Components/ChatList";
import useSWR, { mutate } from "swr";
import useSWRInfinite from 'swr/infinite'
import { IDM } from "../../typings/db";
import { useParams } from "react-router-dom";
import fetcher from "../../utils/fetcher";
import useInput from "../../hooks/useInput";
import axios from "axios";
import makeSection from "../../utils/makeSection";
import Scrollbars from "react-custom-scrollbars-2";
import useSocket from "../../hooks/useSocket";

const DirectMessage = () => {
  const { workspace, id} = useParams<{workspace: string, id: string}>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher)
  const { data: myData } = useSWR(`/api/users`, fetcher)
  const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
    (index: number) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index+1}`,
    fetcher,
  ) // 채팅 가져오는 api
  const [chat, onChangeChat, setChat] = useInput('')
  const scrollbarRef = useRef<Scrollbars>(null);

  const [socket] = useSocket(workspace)
  const [dragOver, setDragOver] = useState(false)

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false

  const onSubmitForm = useCallback((e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setChat('')
    console.log('submit')
    console.log(chat)
    
    if(chat?.trim() && chatData) {
      const savedChat = chat;
      mutateChat((prevChatData) => {
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          SenderId: myData.id,
          Sender: myData,
          ReceiverId: userData.id,
          Receiver: userData,
          createdAt: new Date(),
        });
        return prevChatData
      }, false)
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
        content: chat
      })
      .then(() => {
        mutateChat()
        setChat('')
        scrollbarRef.current?.scrollToBottom()
      })
      .catch(console.error)
    }
  }, [setChat, mutateChat, chat, workspace, id, chatData, myData, userData])
  
  const onMessage = useCallback((data: IDM) => {
    if(data.SenderId === Number(id) && myData.id !== Number(id)) {
      mutateChat((chatData) => {
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
              scrollbarRef.current?.scrollToBottom()
          }
        }
      })
    }
  }, [mutateChat, id, myData])

  const onDrop = useCallback(
    (e: any) => {
      e.preventDefault();
      console.log(e);
      const formData = new FormData();
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
        setDragOver(false);
        mutateChat()
      });
    },
    [mutateChat, workspace, id],
  );

  const onDragOver = useCallback((e: any) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
  }, []);

  useEffect(() => {
    socket?.on('dm', onMessage)
    return () => {
      socket?.off('dm', onMessage)
    }
  }, [socket, onMessage])

  useEffect(() => {
    if(chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData])

  if(!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : [])

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro'})} alt={userData.nickname}></img>
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd}/>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  )
}

export default DirectMessage