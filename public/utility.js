
const dbPromise = idb.open('store', 1, (db) => {
    if (!db.objectStoreNames.contains('chats')) {
        db.createObjectStore('chats', {keyPath: 'id'});
    }
    if (!db.objectStoreNames.contains('messages')) {
        db.createObjectStore('messages', {keyPath: 'id'})
    }
});

const writeData = (st, data) => {
    return dbPromise.then(db => {
        const tx = db.transaction(st, 'readwrite');
        const store = tx.objectStore(st);
        store.put(data);
        return tx.complete;
    })
};

const readAllData = (st) => {
    return dbPromise.then(db => {
        const tx = db.transaction(st, 'readonly');
        const store = tx.objectStore(st);
        return store.getAll();
    })
};

const readData = (st, key) => {
    return dbPromise.then(db => {
        const tx = db.transaction(st, 'readonly');
        const store = tx.objectStore(st);
        return store.get(key);
    })
};

const clearAllData = (st) => {
    return dbPromise.then(db => {
        const tx = db.transaction(st, 'readwrite');
        const store = tx.objectStore(st);
        store.clear();
        return tx.complete;
    })
};

const deleteItemFromData = (st, key) => {
    return dbPromise.then(db => {
        const tx = db.transaction(st, 'readwrite');
        const store = tx.objectStore(st);
        store.delete(key);
        return tx.complete;
    })
};
