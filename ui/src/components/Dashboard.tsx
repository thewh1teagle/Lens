import Item from "./Item";

interface DashboardProps {
  config: DashboardConfig;
}
export default function Dashboard({ config }: DashboardProps) {
  return (
    <div className="p-5">
      <div className="text-center text-3xl">{config.name}</div>
      <div className="mt-20">
        {config.items.map((item) => (
          <Item key={item.query} props={item} />
        ))}
      </div>
    </div>
  );
}
