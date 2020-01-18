import {EventEmitter} from "events";
import {SimpleWalletUser} from "./SimpleWalletUser";
import * as WebSocket from 'websocket';

export class SimpleWalletInterface extends EventEmitter {
    private options: any;
    private ws: any;
    private uuid: string;
    private loginResolver: Function;
    constructor (options: any) {
        super();
        this.uuid = "web-7X5uhNXy";
        this.options = options;

        // connect to websocket
        console.log(`Connecting to SimpleWallet websocket ${this.options.wsUrl}`);
        console.log(`Websocket client`, WebSocket.w3cwebsocket);
        this.ws = new WebSocket.w3cwebsocket(this.options.wsUrl);
        if (!this.ws){
            console.error('Could not connect to websocket');
        }
        this.ws.onerror = function (e) {
            console.log(`websocket error`, e);
        };
        this.ws.onopen = () => {
            console.log(`websocket connected, sending request`);

            this.ws.send(JSON.stringify({uuid: this.uuid}));
        };
        this.ws.onmessage = (msg) => {
            console.log(`WS message`, msg.data);
            const msgObj = JSON.parse(msg.data);
            console.log(`Decoded WS message`, msgObj);
            if (msgObj.actionId !== this.uuid){
                console.warn(`Invalid message ${msgObj.actionId} !== ${this.uuid}`);
                return;
            }

            if (this.loginResolver){
                console.log(`Resolving promise login`);
                const users = [new SimpleWalletUser([], msgObj.wallet, [msgObj.publickey])]
                this.emit('logincomplete', users);
                this.loginResolver(users);
            }
        };
        // this.ws.connect();
    }

    async login () {
        const expiry = ((new Date().getTime() + 60 * 1000) / 1000).toFixed(0);
        const loginReq = {
            "protocol": "SimpleWallet",
            "version": "1.0",
            "dappName": this.options.appName,
            "dappIcon": this.options.appIcon,
            "action": "login",
            "uuID": this.uuid,
            "loginUrl": this.options.returnUrl,
            "expired": expiry,
            "loginMemo": this.options.description
        };

        this.emit('loginstart', loginReq);

        return new Promise((resolve, _reject) => {
            this.loginResolver = resolve;
        });

        // console.log(loginReq, this.options);
    }
}
