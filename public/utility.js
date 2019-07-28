
const dbPromise = idb.open('store', 1, (db) => {
    if (!db.objectStoreNames.contains('chats')) {
        db.createObjectStore('chats', {keyPath: 'id'})
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
