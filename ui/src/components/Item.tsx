import { useEffect, useState } from "react"
import Line from "./Line"
import * as api from '../api'
import Area from "./Area"
import * as config from '../config'
import Invalid from "./Invalid"


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

    const width = props.width ?? config.width
    const height = props.height ?? config.height
    const SelectedComponent = {
        "line": Line,
        "area": Area
    }?.[props.chart_type] ?? Invalid
    
    return (
        <div style={{width, height}} className='mt-auto'>
            <SelectedComponent props={props} data={data} />
        </div>
    )
    


}