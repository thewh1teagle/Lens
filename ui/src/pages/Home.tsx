import { useState } from "react"
import * as api from '../api'

export default function Home() {
    const [rows, setRows] = useState('')
    const [queryValue, setQueryValue] = useState('SELECT * FROM users')

    async function query() {
        const data = await api.query(queryValue)
        setRows(JSON.stringify(data))
    }
    return (
        <div>
            <div className="flex items-center justify-center flex-col">
            <textarea value={queryValue} onChange={e => setQueryValue(e.target.value)} className="textarea-primary textarea-bordered w-[500px] h-[200px] p-2" placeholder="SELECT * FROM table"/>
            <button onClick={query} className="btn btn-primary">Query</button>
            </div>
            

            <div className="flex items-center justify-center">
            <textarea value={rows} className="textarea-primary textarea-bordered w-[500px] h-[200px] p-2" readOnly={true}/>
            </div>

            
        </div>
    )
}