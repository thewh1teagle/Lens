import Widget from "./Widget";
import ThemeToggle from "../ThemeToggle";
import { LensConfig } from "../types";


interface DashboardProps {
  config: LensConfig
}

export default function Dashboard({config}: DashboardProps) {

  return (
    <div className="p-5 mt-5">
      <ThemeToggle />
      <div className="text-center text-4xl">{config?.title}</div>
      <div className="mt-14 flex flex-row flex-wrap gap-5 justify-center">
        {config?.widgets.map((item) => (
          <Widget key={item.id} config={item} />
        ))}
      </div>
    </div>
  );
}
