import React from 'react'
import { IDM } from '../../typings/db'
import Chat from '../Chat';
import { ChatZone, Section } from './styles'

interface Props {
  chatData?: IDM[];
}

const ChatList = ({ chatData }: Props) => {
  return (
    <ChatZone>
      <Section>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat}></Chat>
        ))}
      </Section>
    </ChatZone>
  )
}

export default ChatList