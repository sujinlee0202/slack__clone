import { useCallback, useRef } from 'react'
import { IDM } from '../../typings/db'
import Chat from '../Chat';
import { ChatZone } from './styles'
import { Scrollbars } from 'react-custom-scrollbars-2'

interface Props {
  chatData?: IDM[];
}

const ChatList = ({ chatData }: Props) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, [])

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat}></Chat>
        ))}
      </Scrollbars>
    </ChatZone>
  )
}

export default ChatList