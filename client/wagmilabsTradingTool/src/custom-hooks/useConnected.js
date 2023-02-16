import React from "react"
import { ConnectedContext } from "@Context"

export const useConnected = () => {
    const {connected, setConnected} = React.useContext(ConnectedContext)

    return {connected, setConnected}
}