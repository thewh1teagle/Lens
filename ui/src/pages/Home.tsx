import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { LensConfig } from "../types";
import * as api from "../api";
import { useHotReload } from "../hooks/useHotReload";

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
    <div className="w-full h-full flex flex-col">
      {loading && (
        <div className="p-5 mt-5 w-full h-[100vh] flex justify-center items-center">
          <span className="loading loading-spinner text-primary loading-lg" />
        </div>
      )}
      {config && (
        <div>
          <Dashboard config={config} />
          <footer className="footer footer-center mt-20 mb-3">
            <p className="text-center opacity-50">Lens version {config?.lens_version}</p>
          </footer>
        </div>
      )}
    </div>
  );
}
