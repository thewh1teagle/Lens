import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

export function useHotReload({fetchConfig}: {fetchConfig: () => void}) {
  const { readyState } = useWebSocket(
    `ws://localhost:8080/api/ws`,
    {shouldReconnect(_) {
        return true
    },}
  );

  useEffect(() => {
    fetchConfig()
  }, [readyState])


}
