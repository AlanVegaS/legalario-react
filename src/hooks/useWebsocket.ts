import { useEffect, useRef, useState } from "react";

export interface Transaction {
    id: string
    user_id: string
    amount: string
    state: string | null
    transaction_type: string
    created_at: string | null
}

interface QueueStatusResponse {
    event: string
    total: number
    data: Transaction[]
    transaction_updated?: {
        id: string
        state: string
    }
}

export function useWebSocket(url: string, onTransactionUpdated?: (data: { id: string, state: string }) => void) {
    const ws = useRef<WebSocket | null>(null)
    const [transactions, setTransactions] = useState<QueueStatusResponse | null>(null)
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        ws.current = new WebSocket(url)

        ws.current.onopen = () => setConnected(true)
        ws.current.onclose = () => setConnected(false)
        ws.current.onerror = (e) => console.error("WebSocket error:", e)
        ws.current.onmessage = (e) => {
            try {
                const parsed: QueueStatusResponse = JSON.parse(e.data)
                setTransactions(parsed)
                if (parsed.event === "transaction_updated" && parsed.transaction_updated) {
                    if (onTransactionUpdated) {
                        onTransactionUpdated(parsed.transaction_updated)
                    }
                }
            } catch {
                console.error("Failed to parse WebSocket message:", e.data)
            }
        }

        return () => ws.current?.close()
    }, [url])


    return { transactions, connected }
}