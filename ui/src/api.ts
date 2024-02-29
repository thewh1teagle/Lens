import axios from "axios";

export async function query(query: string): Promise<any> {
    const resp = await axios.get("/api/query", {params: {q: query}})
    return resp.data
}

export async function fetch(url: string, userAgent?: string): Promise<any> {
    const params: any = {url}
    if (userAgent) {
        params['user_agent'] = userAgent
    }
    const resp = await axios.get("/api/fetch", {params})
    return resp.data
}

export async function config(): Promise<DashboardConfig> {
    const res = await axios.get('/api/config')
    return res.data
}