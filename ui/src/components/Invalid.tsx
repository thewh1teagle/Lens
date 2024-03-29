import { WidgetConfig } from "../types";

export default function Invalid({props}: {props: WidgetConfig}) {
    return (
        <div className="text-error overflow-auto h-full w-full">
            <div className="text-center text-3xl p-5">Invalid chart type!</div>
            <textarea className="w-full h-full">
            {JSON.stringify(props)}
            </textarea>
        </div>
    )
}