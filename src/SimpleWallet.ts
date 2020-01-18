import {
    Authenticator,
    Chain,
    User,
    UALError,
} from 'universal-authenticator-library'
import {SimpleWalletUser} from "./SimpleWalletUser";
import {SimpleWalletIcon} from './SimpleWalletIcon';

export class SimpleWallet extends Authenticator {
    public chains: Chain[];
    public options: any;
    private users: SimpleWalletUser[] = [];
    private simplewallet: any = null;
    // private pubKeys: [];
    appName = 'SimpleWallet';
    lastError = null;
    accountName = null;

    constructor(chains: Chain[], options?: any) {
        super(chains, options);

        // const endpoint = `${chains[0].rpcEndpoints[0].protocol}://${chains[0].rpcEndpoints[0].host}:${chains[0].rpcEndpoints[0].port}`;

        this.chains = chains;
        this.options = options;
        console.log(this.simplewallet);
        this.simplewallet = options.simplewallet;
    }

    /**
     * Called after `shouldRender` and should be used to handle any async actions required to initialize the authenticator
     */
    async init(): Promise<void> {
        console.log(`SimpleWallet: init`);
        // this.simplewallet = new SimpleWalletInterface(this.options);
    }


    /**
     * Resets the authenticator to its initial, default state then calls `init` method
     */
    reset() {
    }


    /**
     * Returns true if the authenticator has errored while initializing.
     */
    isErrored() {
        return (this.lastError !== null);
    }


    /**
     * Returns a URL where the user can download and install the underlying authenticator
     * if it is not found by the UAL Authenticator.
     */
    getOnboardingLink() {
        return 'https://github.com/southex/SimpleWallet/blob/master/supporter_list.md';
    }


    /**
     * Returns error (if available) if the authenticator has errored while initializing.
     */
    getError(): UALError | null {
        return this.lastError;
    }


    /**
     * Returns true if the authenticator is loading while initializing its internal state.
     */
    isLoading(): boolean {
        return false;
    }


    /**
     * Returns the style of the Button that will be rendered.
     */
    getStyle() {
        return {
            icon: SimpleWalletIcon,
            text: 'SimpleWallet',
            textColor: 'white',
            background: '#111111'
        }
    }


    /**
     * Returns whether or not the button should render based on the operating environment and other factors.
     * ie. If your Authenticator App does not support mobile, it returns false when running in a mobile browser.
     */
    shouldRender() {
        console.log(`SimpleWallet: should render`);
        return true;
    }


    /**
     * Returns whether or not the dapp should attempt to auto login with the Authenticator app.
     * Auto login will only occur when there is only one Authenticator that returns shouldRender() true and
     * shouldAutoLogin() true.
     */
    shouldAutoLogin() {
        return true;
    }


    /**
     * Returns whether or not the button should show an account name input field.
     * This is for Authenticators that do not have a concept of account names.
     */
    async shouldRequestAccountName(): Promise<boolean> {
        return false;
    }


    /**
     * Login using the Authenticator App. This can return one or more users depending on multiple chain support.
     *
     * @param accountName  The account name of the user for Authenticators that do not store accounts (optional)
     */
    async login(): Promise<User[]> {
        try {
            console.log('login');
            // for (const chain of this.chains) {
            //     const user = new SimpleWalletUser(chain, this.accountName, this.pubKeys);
            //     this.users.push(user);
            // }
            this.users = await this.simplewallet.login();

            console.log(`SimpleWallet: users`, this.users);

            return this.users
        } catch (e) {
            console.error(`SimpleWallet Login error`, e);
        }

        return [];
    }


    /**
     * Logs the user out of the dapp. This will be strongly dependent on each Authenticator app's patterns.
     */
    async logout(): Promise<void> {
        this.users = [];
        // this.pubKeys = [];
    }


    /**
     * Returns true if user confirmation is required for `getKeys`
     */
    requiresGetKeyConfirmation(accountName?: string): boolean {
        if (!accountName) {
            return true;
        }
        return false;
    }
}
