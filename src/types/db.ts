export type CaseStatus = 'pending_review' | 'approved' | 'rejected' | 'closed';

export interface Case {
  id: string;
  reporter_id: string | null;
  full_name: string;
  age: number | null;
  gender: 'M' | 'F' | 'Outro' | null;
  last_seen_location: string | null;
  last_seen_date: string | null;
  description: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  consent: boolean;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
}

export interface CaseWithPhotos extends Case {
  photos: CasePhoto[];
}

export interface CasePhoto {
  id: string;
  case_id: string;
  storage_path: string;
  is_primary: boolean;
}

export interface ContactRequest {
  id: string;
  case_id: string;
  requester_name: string | null;
  requester_email: string | null;
  requester_phone: string | null;
  message: string | null;
  created_at: string;
  handled: boolean;
}

export interface ModerationLog {
  id: string;
  case_id: string;
  moderator_id: string | null;
  action: 'approve' | 'reject' | 'close' | 'note';
  reason: string | null;
  created_at: string;
}
