import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

let globalSocket = null

export function getSocket() {
    if (!globalSocket) {
        globalSocket = io('/', {
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        })
    }
    return globalSocket
}

export default function useSocket(event, handler) {
    const handlerRef = useRef(handler)
    handlerRef.current = handler

    useEffect(() => {
        const socket = getSocket()
        const cb = (...args) => handlerRef.current(...args)
        socket.on(event, cb)
        return () => {
            socket.off(event, cb)
        }
    }, [event])
}
