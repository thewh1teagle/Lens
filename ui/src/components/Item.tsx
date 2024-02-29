import { useEffect, useState } from "react"
import Line from "./Line"
import * as api from '../api'
import Area from "./Area"



interface ItemProps {
    props: ItemConfig
}
export default function Item({props}: ItemProps) {
    const [data, setData] = useState([])

    useEffect(() => {
        async function loadData() {
            if (props.query) {
                const query = props.query
                const res = await api.query(query)
                if (props.debug) {
                    console.log('config => ', props)
                    console.log(`res => `, res)
                }
                setData(res)
            } else if (props.url) {
                const url = props.url
                const res = await api.fetch(url)
                if (props.debug) {
                    console.log('config => ', props)
                    console.log(`res => `, res)
                }
                setData(res)
            }

        }
        loadData()
    }, [])

    if (props.chart_type === 'line') {
        return (
            <div className="w-[800px] h-[500px] mt-auto">
                <Line props={props} data={data} />
            </div>
        )
    }
    if (props.chart_type === 'area') {
        return (
            <div className="w-[800px] h-[500px] mt-auto">
                <Area props={props} data={data} />
            </div>
        )
    }
    
    return (
        <h1>Error! invalid props: <code>{JSON.stringify(props)}</code></h1>
    )
}