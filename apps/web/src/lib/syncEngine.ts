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
    // Simulates syncing the oldest pending item
    const pending = await this.getPendingOperations();
    if (pending.length === 0) return null;
    
    const nextOp = pending[0];
    nextOp.status = 'SYNCED';
    await queueStore.setItem(nextOp.id, nextOp);
    return nextOp;
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
