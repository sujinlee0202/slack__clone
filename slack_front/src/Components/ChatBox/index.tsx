import autosize from 'autosize'
import React, { useCallback, useEffect, useRef } from 'react'
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from './styles'
import { Mention, SuggestionDataItem } from 'react-mentions'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import { IUser, IUserWithOnline } from '../../typings/db'
import fetcher from '../../utils/fetcher'
import gravatar from 'gravatar'

interface Props {
  chat: string
  onSubmitForm: (e: any) => void
  onChangeChat: (e: any) => void
  placeholder?: string
}

const ChatBox = ({ chat, onSubmitForm, onChangeChat, placeholder }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { workspace } = useParams();
  const { data: userData } = useSWR<IUser>(`/api/users`, fetcher, {
    dedupingInterval: 2000,
  })
  const { data: memberData } = useSWR<IUserWithOnline[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher)


  useEffect(() => {
    if(textareaRef.current) {
      autosize(textareaRef.current)
    }
  }, [])

  const onKeyDownChat = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement>) => {
    // enter : submit, shift+enter : 줄바꿈
    if(e.key === 'Enter') {
      if(!e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e)
      }
    }
  }, [onSubmitForm])

  const renderSuggestion: (
    suggestion: SuggestionDataItem, 
    search: string, 
    highlightedDisplay: React.ReactNode, 
    index: number, 
    focused: boolean
    ) => React.ReactNode = useCallback((
      member, search, highlightedDisplay, index, focused
    ) => {
    if(!memberData) return;
    return (
      <EachMention focus={focused}>
        <img src={gravatar.url(memberData[index].email, {s: '20px', d: 'retro'})} alt={memberData[index].nickname}></img>
        <span>{highlightedDisplay}</span>
      </EachMention>
    )
  }, [memberData])
  
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea 
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeyDownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger='@'
            data={memberData?.map((item) => (
              {id: item.id, display: item.nickname}
            )) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  )
}

export default ChatBox