import { forwardRef, useCallback } from 'react'
import { IDM } from '../../typings/db'
import Chat from '../Chat';
import { ChatZone, Section, StickyHeader } from './styles'
import { Scrollbars } from 'react-custom-scrollbars-2'

interface Props {
  chatSections: {[key: string]: IDM[]};
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }: Props, ref) => {
  const onScroll = useCallback((values: any) => {
    if(values.scrollTop === 0 && !isReachingEnd) { // 끝에 도달하면 새로 불러올 필요가 없음
      console.log('가장 위!')
      // data 추가 로딩
      setSize((prevSize) => prevSize + 1)
      .then(() => {
        // Scroll 위치 유지
      })
    }
  }, [isReachingEnd, setSize])

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats?.map((chat) => (
                <Chat key={chat.id} data={chat}></Chat>
              ))}
            </Section>
          )
        })}
      </Scrollbars>
    </ChatZone>
  )
})

export default ChatList