import { useEffect, useState } from "react";
import useWebSocket, { ReadyState, Options } from "react-use-websocket";

export function useHotReload({fetchConfig}: {fetchConfig: () => void}) {
    const [closed, setClosed] = useState(false)
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `ws://localhost:8080/api/ws`,
    {shouldReconnect(event) {
        return true
    },}
  );

  useEffect(() => {
    fetchConfig()
  }, [readyState])


}
