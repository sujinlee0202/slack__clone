import { useCallback } from 'react'
import io from 'socket.io-client'

const backUrl = 'http://localhost:3095'
const sockets: {[key: string]: SocketIOClient.Socket} = {}

const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if(workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace]
    }
  }, [workspace])

  if(!workspace) {
    return [undefined, disconnect];
  }

  if(!sockets[workspace]) { // 기존에 소켓이 없었을 때 새로 만들기
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket']
    })
  }

  return [sockets[workspace], disconnect]

}

export default useSocket