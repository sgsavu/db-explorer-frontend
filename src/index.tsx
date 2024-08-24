import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App/index.tsx"
import "./bindings.ts"
import "./index.css"
import "@sgsavu/db-explorer-components/dist/index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
