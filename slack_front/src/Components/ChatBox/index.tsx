import autosize from 'autosize'
import React, { useCallback, useEffect, useRef } from 'react'
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from './styles'

interface Props {
  chat: string
  onSubmitForm: (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => void
  onChangeChat: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
}

const ChatBox = ({ chat, onSubmitForm, onChangeChat, placeholder }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if(textareaRef.current) {
      autosize(textareaRef.current)
    }
  }, [])

  const onKeyDownChat = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // enter : submit, shift+enter : 줄바꿈
    if(e.key === 'Enter') {
      if(!e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e)
      }
    }
  }, [onSubmitForm])
  
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea 
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeyDownChat}
          placeholder={placeholder}
          ref={textareaRef}
        />
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