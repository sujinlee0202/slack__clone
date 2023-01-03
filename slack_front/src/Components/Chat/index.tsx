import React, { useMemo } from 'react'
import { IChat, IDM } from '../../typings/db'
import { ChatWrapper } from './styles'
import gravatar from 'gravatar'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import regexifyString from 'regexify-string'

interface Props {
  data: IDM | IChat
}

const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';


const Chat = ({ data }: Props) => {
  const { workspace } = useParams<{workspace: string; channel: string}>();
  const user = 'Sender' in data ? data.Sender : data.User

  const result = useMemo(() => 
  data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
    <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
  )
  : (regexifyString({
    input: data.content,
    // @[티치냥](7)
    pattern: /@\[(.+?)\]\((\d+?)\)|\n/g, // id, 줄바꿈
    decorator(match, index) {
      const arr = match.match(/@\[(.+?)\]\((\d+?)\)/)!;
      if(arr) {
        return (
          <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
            @{arr[1]}
          </Link>
          )
      }
      return <br key={index} />
    }
  })), [data.content, workspace])

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
        <p>{result}</p>
      </div>
    </ChatWrapper>
  )
}

export default Chat