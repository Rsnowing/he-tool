export default class Key {
    apiKey: string;
    setApiKey(value: string): void;
    getKey(): string;
    validateKey(): Promise<unknown>;
}
