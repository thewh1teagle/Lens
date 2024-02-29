import { useState } from "react"
import * as api from '../api'
import Dashboard from "../components/Dashboard"
import config from '../dashboard.json'

export default function Home() {

    return <Dashboard config={config}  />
}







