import { useEffect } from "react";
import Item from "./Item";
interface DashboardProps {
  config: DashboardConfig;
}
export default function Dashboard({ config }: DashboardProps) {

  useEffect(() => {
    document.title = config.name
  }, [])
  return (
    <div className="p-5 mt-5">
      <div className="text-center text-4xl">{config.name}</div>
      <div className="mt-20 flex flex-row flex-wrap gap-5 justify-center">
        {config.items.map((item) => (
          <Item key={item.query} props={item} />
        ))}
      </div>
    </div>
  );
}
