import moment from "moment";
import * as config from "../config";


interface DateRangeProps {
  setRangeFuncName: (name: string) => void
  rangeFuncName: string
}

export default function DateRange({ rangeFuncName, setRangeFuncName }: DateRangeProps) {
  const options = Object.keys(config.dateRangesFuncs);
  

  return (
    <select onChange={e => setRangeFuncName(e.target.value)} value={rangeFuncName} className="select select-bordered w-40 select-sm">
      {options.map((o) => (
        <option value={o} key={o}>{o}</option>
      ))}
    </select>
  );
}
