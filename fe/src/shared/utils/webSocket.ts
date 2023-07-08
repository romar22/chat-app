
export class WSocket{
    webSocket: WebSocket;

    constructor(api: string){
        this.webSocket = new WebSocket(api);
    }

    onMessage(callback: Function){
        this.webSocket.onmessage = (e) => {
            callback(JSON.parse(e.data), e);
        }
    }
}