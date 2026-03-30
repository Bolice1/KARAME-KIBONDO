import localforage from 'localforage';

export interface SyncOperation {
  id: string;
  type: 'ATTENDANCE' | 'NUTRITION';
  payload: any;
  timestamp: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

const queueStore = localforage.createInstance({
  name: 'karame_kibondo',
  storeName: 'sync_queue'
});

export const syncEngine = {
  async addOperation(op: Omit<SyncOperation, 'id' | 'status' | 'timestamp'>) {
    const id = crypto.randomUUID();
    const fullOp: SyncOperation = {
      ...op,
      id,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };
    await queueStore.setItem(id, fullOp);
    return id;
  },

  async getPendingOperations(): Promise<SyncOperation[]> {
    const ops: SyncOperation[] = [];
    await queueStore.iterate((value: SyncOperation) => {
      if (value.status === 'PENDING') {
        ops.push(value);
      }
    });
    return ops.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  async mockSyncNext() {
    const pending = await this.getPendingOperations();
    if (pending.length === 0) return null;
    
    try {
      // POST to our new backend
      const response = await fetch('http://localhost:3000/api/sync/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operations: pending })
      });

      if (!response.ok) throw new Error('Sync failed');

      const data = await response.json();
      
      // Update local status based on backend idempotent resolution
      if (data.processed) {
        for (const res of data.processed) {
           const op = await queueStore.getItem<SyncOperation>(res.id);
           if (op && res.status === 'SYNCED') {
             op.status = 'SYNCED';
             await queueStore.setItem(op.id, op);
           }
        }
      }
      return data;
    } catch(e) {
      console.warn('Network error or API offline. Data remains queued.', e);
      return null;
    }
  },
  
  async getStats() {
    let pendingCount = 0;
    let syncedCount = 0;
    await queueStore.iterate((value: SyncOperation) => {
      if (value.status === 'PENDING') pendingCount++;
      if (value.status === 'SYNCED') syncedCount++;
    });
    return { pendingCount, syncedCount };
  }
};
