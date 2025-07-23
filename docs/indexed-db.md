# IndexedDB API Reference for vault.ts

This document explains every IndexedDB API used in the `vault.ts` file with minimal examples.

## Database Operations

### `indexedDB.open(name, version)`
Opens or creates an IndexedDB database.

```javascript
// Basic usage
const request = indexedDB.open("myDatabase", 1)

// Returns an IDBOpenDBRequest
request.onsuccess = (event) => {
  const db = event.target.result
  console.log("Database opened:", db.name)
}

request.onerror = (event) => {
  console.error("Failed to open database:", event.target.error)
}
```

**In vault.ts**: Used in `open_database()` to open the "walle" database.

### `onupgradeneeded` Event
Triggered when database version changes or database is created for the first time.

```javascript
const request = indexedDB.open("myDatabase", 1)

request.onupgradeneeded = (event) => {
  const db = event.target.result
  
  // This runs when database is first created or version upgraded
  if (!db.objectStoreNames.contains("myStore")) {
    db.createObjectStore("myStore")
  }
}
```

**In vault.ts**: Creates the "vault" object store if it doesn't exist.

### `db.createObjectStore(name)`
Creates a new object store (like a table in SQL).

```javascript
// During onupgradeneeded event
const store = db.createObjectStore("users")

// With options
const storeWithKey = db.createObjectStore("products", { keyPath: "id" })
```

**In vault.ts**: Creates the "vault" object store to hold encrypted vault data.

## Transaction Management

### `db.transaction(storeNames, mode)`
Creates a transaction to perform operations on object stores.

```javascript
// Read-only transaction (default)
const readTx = db.transaction("myStore", "readonly")

// Read-write transaction
const writeTx = db.transaction("myStore", "readwrite")

// Multiple stores
const multiTx = db.transaction(["store1", "store2"], "readonly")
```

**In vault.ts**: Used to create transactions for reading and writing vault data.

### `transaction.objectStore(name)`
Gets access to an object store within a transaction.

```javascript
const transaction = db.transaction("myStore", "readwrite")
const store = transaction.objectStore("myStore")

// Now you can perform operations on the store
```

**In vault.ts**: Gets the "vault" object store for data operations.

## Data Operations

### `store.put(value, key)`
Stores data in the object store. Creates or updates.

```javascript
const transaction = db.transaction("myStore", "readwrite")
const store = transaction.objectStore("myStore")

// Store with explicit key
const request = store.put({ name: "John", age: 30 }, "user1")

request.onsuccess = () => console.log("Data stored")
request.onerror = () => console.error("Failed to store data")
```

**In vault.ts**: Used in `set_vault()` to store the encrypted vault record.

### `store.get(key)`
Retrieves data from the object store.

```javascript
const transaction = db.transaction("myStore", "readonly")
const store = transaction.objectStore("myStore")

const request = store.get("user1")

request.onsuccess = () => {
  const data = request.result
  if (data) {
    console.log("Found data:", data)
  } else {
    console.log("No data found for key")
  }
}
```

**In vault.ts**: Used in `get_vault()` and `vault_exists()` to retrieve vault data.

### `store.delete(key)`
Removes data from the object store.

```javascript
const transaction = db.transaction("myStore", "readwrite")
const store = transaction.objectStore("myStore")

const request = store.delete("user1")

request.onsuccess = () => console.log("Data deleted")
request.onerror = () => console.error("Failed to delete data")
```

**In vault.ts**: Used in `delete_vault()` to remove the vault record.

## Promise Wrappers

Since IndexedDB uses callbacks, the vault.ts file wraps operations in Promises for cleaner async/await usage.

### Basic Promise Wrapper Pattern

```javascript
function promiseWrapper() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("database", 1)
    
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error(request.error?.message))
  })
}

// Usage
try {
  const db = await promiseWrapper()
  console.log("Database opened successfully")
} catch (error) {
  console.error("Database operation failed:", error)
}
```

**In vault.ts**: All functions return Promises wrapping IndexedDB operations.

### Transaction Promise Pattern

```javascript
function storeData(key, value) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("store", "readwrite")
    const store = transaction.objectStore("store")
    const request = store.put(value, key)
    
    request.onsuccess = () => resolve()
    request.onerror = () => reject(new Error(request.error?.message))
  })
}
```

**In vault.ts**: Used in `set_vault()`, `get_vault()`, and `delete_vault()`.

## Error Handling Patterns

### Request-level Error Handling

```javascript
const request = store.get("key")

request.onsuccess = () => {
  // Handle success
}

request.onerror = () => {
  console.error("Operation failed:", request.error?.message)
}
```

### Transaction-level Error Handling

```javascript
const transaction = db.transaction("store", "readwrite")

transaction.oncomplete = () => console.log("Transaction completed")
transaction.onerror = () => console.error("Transaction failed")
transaction.onabort = () => console.log("Transaction aborted")
```

**In vault.ts**: Uses request-level error handling wrapped in Promise rejections.

## Complete Minimal Example

Here's a complete minimal example showing the pattern used in vault.ts:

```javascript
// Open database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("testDB", 1)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains("data")) {
        db.createObjectStore("data")
      }
    }
    
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error(request.error?.message))
  })
}

// Store data
async function saveData(key, value) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("data", "readwrite")
    const store = tx.objectStore("data")
    const request = store.put(value, key)
    
    request.onsuccess = () => resolve()
    request.onerror = () => reject(new Error(request.error?.message))
  })
}

// Get data
async function getData(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("data", "readonly")
    const store = tx.objectStore("data")
    const request = store.get(key)
    
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error(request.error?.message))
  })
}

// Usage
await saveData("user", { name: "Alice" })
const user = await getData("user")
console.log(user) // { name: "Alice" }
```

This pattern of Promise-wrapped IndexedDB operations is exactly what's used throughout the vault.ts file for secure mnemonic storage.

## High-Level Overview: How IndexedDB Entities Interact

IndexedDB follows a hierarchical structure where each level has specific responsibilities:

```
Browser
└── IndexedDB (per origin)
    └── Database ("walle", version 1)
        └── Object Store ("vault")
            └── Records (key-value pairs)
                └── Key: "vault"
                └── Value: { salt, iv, cipher }
```

### Entity Relationships and Flow

#### 1. Database Level
- **One database per application**: "walle" database holds all wallet data
- **Version control**: Version 1 defines the current schema
- **Upgrade mechanism**: `onupgradeneeded` handles schema changes

#### 2. Object Store Level
- **Like a table**: "vault" object store contains encrypted mnemonic data
- **Key-value storage**: Simple key ("vault") → value (VaultRecord) mapping
- **Transaction scope**: All operations must happen within transactions

#### 3. Transaction Level
- **Atomic operations**: Either all operations succeed or all fail
- **Mode control**: "readonly" for reads, "readwrite" for writes
- **Concurrency**: Multiple readonly transactions can run simultaneously

#### 4. Request Level
- **Individual operations**: Each get/put/delete returns a request
- **Event-driven**: Success/error callbacks handle results
- **Asynchronous**: Non-blocking operations with callback results

### Data Flow in vault.ts

```
Application Request
       ↓
   open_database()
       ↓
   Database Instance
       ↓
   Create Transaction
       ↓
   Get Object Store
       ↓
   Execute Operation (get/put/delete)
       ↓
   Handle Result via Callbacks
       ↓
   Return Promise Resolution
```

### Specific Interactions by Operation

#### **Creating a Vault** (`set_vault`)
1. **Database**: Open "walle" database (create if needed)
2. **Object Store**: Create "vault" store during `onupgradeneeded`
3. **Transaction**: Start "readwrite" transaction on "vault" store
4. **Operation**: `store.put(encryptedData, "vault")`
5. **Result**: Promise resolves when data is persisted

#### **Reading a Vault** (`get_vault`, `vault_exists`)
1. **Database**: Open existing "walle" database
2. **Transaction**: Start "readonly" transaction on "vault" store
3. **Operation**: `store.get("vault")`
4. **Result**: Returns VaultRecord or undefined

#### **Deleting a Vault** (`delete_vault`)
1. **Database**: Open existing "walle" database
2. **Transaction**: Start "readwrite" transaction on "vault" store
3. **Operation**: `store.delete("vault")`
4. **Result**: Promise resolves when record is removed

### Key Design Patterns

#### **Single Point of Access**
- All operations use the same database/store/key combination
- Consistent configuration via `DATABASE_CONFIG`
- Centralized error handling

#### **Promise Wrapping**
- IndexedDB's callback-based API wrapped in Promises
- Enables async/await usage in application code
- Consistent error propagation

#### **Atomic Operations**
- Each vault operation is a single transaction
- No partial states - operations either fully succeed or fail
- Data integrity guaranteed

#### **Event-Driven Flow**
```
Request Created → Event Fired → Callback Executed → Promise Resolved
```

This architecture ensures that:
- **Data integrity**: Transactions prevent corruption
- **Performance**: Asynchronous operations don't block UI
- **Reliability**: Structured error handling at each level
- **Simplicity**: Single key-value pair per application instance