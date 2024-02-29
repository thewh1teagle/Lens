import axios from "axios";

export async function query(query: string): Promise<any> {
    const resp = await axios.get("/api/query", {params: {q: query}})
    return resp.data
}