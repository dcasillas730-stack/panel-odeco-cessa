import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  limit,
  onSnapshot
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { 
  StaffMember, 
  LeaveRecord, 
  ODECOCase, 
  CustomFormTemplate, 
  StaffRequestsDoc,
  QueueHelpAlert,
  ContactCenterMessage,
  SystemStatus 
} from "../types/odeco";

// Colecciones de Firestore
const STAFF_COL = 'staff';
const LEAVES_COL = 'leaves';
const CASES_COL = 'cases';
const ALERTS_COL = 'alerts';
const TEMPLATES_COL = 'templates';
const REQUESTS_COL = 'requests';
const CONTACT_MSGS_COL = 'contact_messages';
const SYSTEM_COL = 'system';

/**
 * Inicializa Firestore con datos iniciales si las colecciones están vacías
 */
export async function bootstrapFirestoreData(initialData: {
  staffList: StaffMember[];
  leaveRecords: LeaveRecord[];
  odecoCases: ODECOCase[];
  templates: CustomFormTemplate[];
  queueHelpAlerts: QueueHelpAlert[];
  contactCenterMessages: ContactCenterMessage[];
  systemStatus: SystemStatus;
}) {
  try {
    const staffRef = collection(db, STAFF_COL);
    const snapshot = await getDocs(query(staffRef, limit(1)));
    
    if (snapshot.empty) {
      for (const staff of initialData.staffList) {
        await setDoc(doc(db, STAFF_COL, staff.id), staff);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, STAFF_COL);
  }
}