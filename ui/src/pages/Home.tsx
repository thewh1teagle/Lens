import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { LensConfig } from "../types";
import * as api from "../api";
import { useHotReload } from "../hooks/useHotReload";
import Footer from "../components/Footer";

export default function Home() {
  const [config, setConfig] = useState<LensConfig>();
  const [loading, setLoading] = useState(true);

  async function fetchConfig() {
    const config = await api.config();
    setConfig(config);
    document.title = config.title;
    setLoading(false);
  }

  useHotReload({ fetchConfig });

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div className="pt-5 pb-3 px-5 w-full h-full flex flex-col">
      {loading && (
        <div className="p-5 mt-5 w-full flex justify-center items-center">
          <span className="loading loading-spinner text-primary loading-lg" />
        </div>
      )}
      {config && (
        <>
          <Dashboard config={config} />
          <Footer config={config} />
          </>
      )}
    </div>
  );
}
