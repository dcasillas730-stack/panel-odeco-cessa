import { 
  StaffMember, 
  LeaveRecord, 
  ODECOCase, 
  CustomFormTemplate, 
  StaffRequestDoc, 
  QueueHelpAlert,
  ContactCenterMessage,
  ContactCenterSchedule
} from '../types/odeco';

export interface RemoteStoreState {
  staffList: StaffMember[];
  leavesList: LeaveRecord[];
  casesList: ODECOCase[];
  templatesList: CustomFormTemplate[];
  requestsList: StaffRequestDoc[];
  activeQueueAlert: QueueHelpAlert | null;
  supervisorPin: string;
  contactCenterMessages: ContactCenterMessage[];
  version: number;
}

export async function fetchRemoteState(): Promise<RemoteStoreState | null> {
  try {
    const res = await fetch('/api/state', {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function apiCreateLeave(leave: LeaveRecord, updatedStatus: string) {
  try {
    const res = await fetch('/api/leaves/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leave, updatedStatus }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiReturnLeave(leaveId: string, returnTime: string, notes?: string) {
  try {
    const res = await fetch('/api/leaves/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leaveId, returnTime, notes }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiTriggerAlert(alert: QueueHelpAlert) {
  try {
    const res = await fetch('/api/alert/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alert }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiRespondAlert(staffId: string) {
  try {
    const res = await fetch('/api/alert/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiResolveAlert() {
  try {
    const res = await fetch('/api/alert/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiCreateRequest(requestDoc: StaffRequestDoc) {
  try {
    const res = await fetch('/api/requests/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestDoc }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiSignRequest(requestId: string, signedDate: string, observations?: string) {
  try {
    const res = await fetch('/api/requests/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, signedDate, observations }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiDeleteRequest(requestId: string) {
  try {
    const res = await fetch('/api/requests/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiCreateTemplate(template: CustomFormTemplate) {
  try {
    const res = await fetch('/api/templates/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiAddStaff(newStaff: StaffMember) {
  try {
    const res = await fetch('/api/staff/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newStaff }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiUpdateStaff(id: string, updatedData: Partial<StaffMember>) {
  try {
    const res = await fetch('/api/staff/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updatedData }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiDeleteStaff(id: string) {
  try {
    const res = await fetch('/api/staff/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiUpdatePin(newPin: string) {
  try {
    const res = await fetch('/api/supervisor/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPin }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiResetData() {
  try {
    const res = await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiSendContactMessage(message: ContactCenterMessage) {
  try {
    const res = await fetch('/api/contact-center/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiUpdateContactSchedule(staffId: string, schedule: ContactCenterSchedule) {
  try {
    const res = await fetch('/api/contact-center/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, schedule }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiMarkContactMessagesRead(readerRole: 'supervisor' | 'contact_center') {
  try {
    const res = await fetch('/api/contact-center/messages/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readerRole }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
