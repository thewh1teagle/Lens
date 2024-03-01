import axios from "axios";

axios.interceptors.response.use((response: any) => {
    return response
  }, (error) => {
    // Do something with response error
    if (error.response.data.error) {
        return Promise.reject(`API Error: ${error.response.data.error}`);    
    }
    return Promise.reject(error);
  });

export async function query(query: string): Promise<any> {
    const resp = await axios.get("/api/query", {params: {q: query}})
    return resp.data
}

interface FetchProps {
    url: string
    userAgent?: string
    startDate?: string
    endDate?: string
}
export async function fetch({url, ...args}: FetchProps): Promise<any> {
    const query: any = {url}
    if (args.userAgent) {
        query['user_agent'] = args.userAgent
    }
    if (args.startDate && args.endDate) {
        query["start_date"] = args.startDate
        query["end_date"] = args.endDate
    }
    const resp = await axios.get("/api/fetch", {params: query})
    return resp.data
}

export async function config(): Promise<LensConfig> {
    const res = await axios.get('/api/config')
    return res.data
}