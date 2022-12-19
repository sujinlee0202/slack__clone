import React, { useCallback, useRef } from "react";
import { Container, Header } from "./styles";
import gravatar from 'gravatar'
import ChatBox from "../../Components/ChatBox";
import ChatList from "../../Components/ChatList";
import useSWR from "swr";
import useSWRInfinite from 'swr/infinite'
import { IDM, IUser } from "../../typings/db";
import { useParams } from "react-router-dom";
import fetcher from "../../utils/fetcher";
import useInput from "../../hooks/useInput";
import axios from "axios";
import makeSection from "../../utils/makeSection";
import Scrollbars from "react-custom-scrollbars-2";

const DirectMessage = () => {
  const { workspace, id} = useParams<{workspace: string, id: string}>();
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher)
  const { data: myData } = useSWR(`/api/users`, fetcher)
  const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
    (index: number) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index+1}`,
    fetcher,
  ) // 채팅 가져오는 api
  const [chat, onChangeChat, setChat] = useInput('')
  const scrollbarRef = useRef<Scrollbars>(null);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false

  const onSubmitForm = useCallback((e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setChat('')
    console.log('submit')
    console.log(chat)
    if(chat?.trim()) {
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
        content: chat
      })
      .then(() => {
        mutateChat()
        setChat('')
      })
      .catch(console.error)
    }
  }, [setChat, mutateChat, chat, workspace, id])

  if(!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : [])

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro'})} alt={userData.nickname}></img>
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd}/>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
    </Container>
  )
}

export default DirectMessage