import {type RealtimeResponseEvent, type Models, Client} from 'appwrite';

const client = new Client();
client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export type Profile = {
    balance: number;
} & Models.Document;

export class AppwriteService {
    // SSR related
    public static setSSR(cookieStr: string) {
        const authCookies: any = {};
        authCookies[`a_session_${import.meta.env.VITE_APPWRITE_PROJECT_ID}`] = cookieStr;
        client.headers['X-Fallback-Cookies'] = JSON.stringify(authCookies);
    }

    // Authentication-related
    public static async createAccount() {
        return await client.account.createAnonymousSession();
    }

    public static async getAccount() {
        return await client.account.get();
    }

    public static async signOut() {
        return await client.account.deleteSession('current');
    }

    // Profile-related
    public static async getProfile(userId: string): Promise<Profile> {
        const response = await client.functions.createExecution('createProfile', undefined, false);
        if (response.statusCode !== 200) { throw new Error(response.stderr); }

        return JSON.parse(response.response).profile;
    }

    public static async subscribeProfile(userId: string, callback: (payload: RealtimeResponseEvent<Profile>) => void) {
        client.subscribe(`collections.profiles.documents.${userId}`, callback);
    }

    // Game-related
    public static async bet(betPrice: number, betSide: 'tails' | 'heads'): Promise<boolean> {
        const response = await client.functions.createExecution('placeBet', JSON.stringify({
            betPrice,
            betSide
        }), false);

        if (response.statusCode !== 200) { throw new Error(response.stderr); }

        return JSON.parse(response.response).didWin;
    }
}