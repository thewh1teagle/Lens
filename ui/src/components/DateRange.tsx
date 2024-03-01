import * as config from "../config";


interface DateRangeProps {
  setRangeFuncName: (name: string) => void
  rangeFuncName: string
}

export default function DateRange({ rangeFuncName, setRangeFuncName }: DateRangeProps) {
  const options = Object.entries(config.dateRangesFuncs);
  

  return (
    <select onChange={e => setRangeFuncName(e.target.value)} value={rangeFuncName} className="select select-bordered w-40 select-sm">
      {options.map(([key, value]) => (
        <option value={key} key={key}>{value.label}</option>
      ))}
    </select>
  );
}
