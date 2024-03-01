import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import * as config from '../config'

export function useHotReload({fetchConfig}: {fetchConfig: () => void}) {
  const { readyState } = useWebSocket(
    config.wsURL,
    {shouldReconnect(_) {
        return true
    },}
  );

  useEffect(() => {
    fetchConfig()
  }, [readyState])


}
