import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const storage = new MMKV({
    id: 'lich-viet-storage',
    // In production, we should use a secure key from Keychain/Keystore
    // encryptionKey: 'optional-encryption-key',
});

export const mmkvStorage: StateStorage = {
    getItem: (name: string): string | null => {
        const value = storage.getString(name);
        return value ?? null;
    },
    setItem: (name: string, value: string): void => {
        storage.set(name, value);
    },
    removeItem: (name: string): void => {
        storage.delete(name);
    },
};

export function initializeStorage(): void {
    // Migration logic if needed
    const version = storage.getNumber('version') ?? 0;
    if (version < 1) {
        // Initial setup
        storage.set('version', 1);
    }
}
