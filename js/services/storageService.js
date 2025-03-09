export class StorageService {
    constructor() {
        this.dbName = 'ship40k';
        this.dbVersion = 1;
        this.storeName = 'ships';
        this.db = null;
        this.isIndexedDBSupported = 'indexedDB' in window;
    }

    async init() {
        if (!this.isIndexedDBSupported) {
            console.warn('IndexedDB not supported, falling back to localStorage');
            return;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Error opening IndexedDB');
                this.isIndexedDBSupported = false;
                resolve();
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
        });
    }

    generateId() {
        return `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async saveShip(shipData) {
        const shipToSave = {
            id: shipData.id || this.generateId(),
            ...shipData,
            lastModified: new Date().toISOString()
        };

        if (this.isIndexedDBSupported && this.db) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(shipToSave);

                request.onsuccess = () => resolve(shipToSave);
                request.onerror = () => reject(new Error('Error saving ship to IndexedDB'));
            });
        } else {
            try {
                const ships = this.getLocalStorageShips();
                const existingIndex = ships.findIndex(ship => ship.id === shipToSave.id);
                
                if (existingIndex !== -1) {
                    ships[existingIndex] = shipToSave;
                } else {
                    ships.push(shipToSave);
                }

                localStorage.setItem('ships', JSON.stringify(ships));
                return shipToSave;
            } catch (error) {
                throw new Error('Error saving ship to localStorage');
            }
        }
    }

    async getShip(id) {
        if (this.isIndexedDBSupported && this.db) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(id);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(new Error('Error retrieving ship from IndexedDB'));
            });
        } else {
            const ships = this.getLocalStorageShips();
            return ships.find(ship => ship.id === id);
        }
    }

    async getAllShips() {
        if (this.isIndexedDBSupported && this.db) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.getAll();

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(new Error('Error retrieving ships from IndexedDB'));
            });
        } else {
            return this.getLocalStorageShips();
        }
    }

    async deleteShip(id) {
        if (this.isIndexedDBSupported && this.db) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.delete(id);

                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(new Error('Error deleting ship from IndexedDB'));
            });
        } else {
            try {
                const ships = this.getLocalStorageShips();
                const filteredShips = ships.filter(ship => ship.id !== id);
                localStorage.setItem('ships', JSON.stringify(filteredShips));
                return true;
            } catch (error) {
                throw new Error('Error deleting ship from localStorage');
            }
        }
    }

    getLocalStorageShips() {
        try {
            return JSON.parse(localStorage.getItem('ships')) || [];
        } catch (error) {
            console.error('Error parsing ships from localStorage');
            return [];
        }
    }

    async clearAllData() {
        if (this.isIndexedDBSupported && this.db) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.clear();

                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(new Error('Error clearing IndexedDB'));
            });
        } else {
            localStorage.removeItem('ships');
            return true;
        }
    }

    // Migration helper
    async migrateFromLocalStorage() {
        if (!this.isIndexedDBSupported || !this.db) {
            return false;
        }

        const localShips = this.getLocalStorageShips();
        if (localShips.length === 0) {
            return true;
        }

        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        return Promise.all(
            localShips.map(ship => 
                new Promise((resolve, reject) => {
                    const request = store.put(ship);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject();
                })
            )
        ).then(() => {
            localStorage.removeItem('ships');
            return true;
        }).catch(() => {
            console.error('Error migrating data from localStorage to IndexedDB');
            return false;
        });
    }

    // Backup functionality
    async exportData() {
        const ships = await this.getAllShips();
        const backup = {
            version: this.dbVersion,
            timestamp: new Date().toISOString(),
            ships: ships
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        return blob;
    }

    async importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (!data.ships || !Array.isArray(data.ships)) {
                throw new Error('Invalid backup format');
            }

            await this.clearAllData();
            await Promise.all(data.ships.map(ship => this.saveShip(ship)));
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}
