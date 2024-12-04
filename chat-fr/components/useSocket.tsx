import { useEffect, useState } from "react";


const useSocket = ( url: string) => {
    const [ socket , setSocket ] = useState<WebSocket | null>(null);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            const ws = new WebSocket(url);
            ws.onopen = () => {
                ws.send(JSON.stringify({ 
                    type: "join",
                    payload : {
                    roomId: "red"
                    }
                }))
                setLoading(false);
            }
            ws.onerror = (error) => {
                setError(error as unknown as Error);
                setLoading(false);
            }
            setSocket(ws);
        }catch (e) {
            setError( e as Error)
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchData();
        return () => {
            if (socket) {
                socket.close();
            }
        }
    },[url]);

    return { socket, loading, error };
}

export default useSocket;