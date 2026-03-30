export interface AuthResponse {
  token: string;
  user: UserPayload;
}

export interface UserPayload {
  id: string;
  name: string;
  role: 'admin' | 'teacher' | 'parent';
  centerId?: string;
}

export type SyncStatus = 'PENDING' | 'SYNCED' | 'FAILED';

export interface BaseSyncOperation {
  id: string;
  timestamp: string;
  status: SyncStatus;
}

export interface AttendanceOpPayload {
  childId: string;
  status: 'present' | 'absent';
}

export interface NutritionOpPayload {
  centerId: string;
  type: string;
}

export type SyncOperation = BaseSyncOperation & (
  | { type: 'ATTENDANCE'; payload: AttendanceOpPayload }
  | { type: 'NUTRITION'; payload: NutritionOpPayload }
);

export interface AlertSchema {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}
