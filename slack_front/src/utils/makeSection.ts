import dayjs from "dayjs"
import { IChat, IDM } from "../typings/db"

const makeSection = (chatList: (IDM | IChat)[]) => {
  const sections: { [key: string]:(IDM | IChat)[] } = {}
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD')
    if(Array.isArray(sections[monthDate])) { // monthDate가 있는 경우
      sections[monthDate].push(chat)
    } else { // 처음 만드는 경우
      sections[monthDate] = [chat]
    }
  })
  return sections
}

export default makeSection