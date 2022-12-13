import React from 'react'
import { IDM } from '../../typings/db'
import { ChatWrapper } from './styles'
import gravatar from 'gravatar'
import dayjs from 'dayjs'

interface Props {
  data: IDM
}

const Chat = ({ data }: Props) => {
  const user = data.Sender

  return (
    <ChatWrapper>
      <div className='chat-img'>
        <img src={gravatar.url(user.email, {s: '36px', d: 'retro'})} alt={user.nickname}></img>
      </div>
      <div className='chat-text'>
        <div className='chat-user'>
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('MM/DD hh:mm')}</span>
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  )
}

export default Chat