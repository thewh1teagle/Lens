import { useEffect, useState } from "react";
import Item from "./Item";
import * as api from '../api'
import ThemeToggle from "../ThemeToggle";


export default function Dashboard() {
  const [config, setConfig] = useState<DashboardConfig>()
  const [loading, setLoading] = useState(true)

  async function fetchConfig() {
    const config = await api.config()
    setConfig(config)
    document.title = config.name
    setLoading(false)
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  if (loading) {
    return (
      <div className="p-5 mt-5 w-full h-[100vh] flex justify-center items-center">
        <span className="loading loading-spinner text-primary loading-lg" />
      </div>
    )
  }
  return (
    <div className="p-5 mt-5">
      <ThemeToggle />
      <div className="text-center text-4xl">{config?.name}</div>
      <div className="mt-14 flex flex-row flex-wrap gap-5 justify-center">
        {config?.items.map((item) => (
          <Item key={item.query} props={item} />
        ))}
      </div>
    </div>
  );
}
