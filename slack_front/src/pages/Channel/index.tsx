import React, { useCallback } from "react";
import ChatBox from "../../Components/ChatBox";
import useInput from "../../hooks/useInput";
import { Container, Header } from "./styles";

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('')

  const onSubmitForm = useCallback((e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setChat('')
    console.log('submit')
  }, [setChat])

  return (
    <Container>
      <Header>Channel</Header>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
    </Container>
  )
}

export default Channel