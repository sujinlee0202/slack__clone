import React, { useCallback } from "react";
import { Container, Header } from "./styles";
import gravatar from 'gravatar'
import ChatBox from "../../Components/ChatBox";
import ChatList from "../../Components/ChatList";
import useSWR from "swr";
import { IUser } from "../../typings/db";
import { useParams } from "react-router-dom";
import fetcher from "../../utils/fetcher";
import useInput from "../../hooks/useInput";

const DirectMessage = () => {
  const { workspace, id} = useParams<{workspace: string, id: string}>();
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher)
  const { data: myData } = useSWR(`/api/users`, fetcher)

  const [chat, onChangeChat, setChat] = useInput('')

  const onSubmitForm = useCallback((e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setChat('')
    console.log('submit')
  }, [setChat])

  if(!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro'})} alt={userData.nickname}></img>
        <span>{userData.nickname}</span>
      </Header>
      <ChatList></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
    </Container>
  )
}

export default DirectMessage