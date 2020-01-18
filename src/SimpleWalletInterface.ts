import {EventEmitter} from "events";
import {SimpleWalletUser} from "./SimpleWalletUser";

export class SimpleWalletInterface extends EventEmitter {
    private options: any;
    constructor (options: any) {
        super();
        this.options = options;
    }

    async login () {
        const expiry = ((new Date().getTime() + 60 * 60 * 1000) / 1000).toFixed(0);
        const loginReq = {
            "protocol": "SimpleWallet",
            "version": "1.0",
            "dappName": this.options.appName,
            "dappIcon": this.options.appIcon,
            "action": "login",
            "uuID": "web-7X5uhNXy",
            "loginUrl": this.options.returnUrl,
            "expired": expiry,
            "loginMemo": this.options.description
        };

        this.emit('loginstart', loginReq);

        return new Promise((resolve, _reject) => {
            window.setTimeout(() => {
                const users = [new SimpleWalletUser([], 'blahblahblah', [])]
                this.emit('logincomplete', users);
                resolve(users)
            }, 3000);
        });

        // console.log(loginReq, this.options);
    }
}
