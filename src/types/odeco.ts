export type StaffStatus = 'at_desk' | 'on_mission' | 'break' | 'delayed';

export type LeaveCategory =
  | 'salida_bano'              // Salida al baño / servicios higiénicos (5 a 10 min)
  | 'refrigerio_reglamentario' // Refrigerio / almuerzo reglamentario
  | 'inspeccion_campo'         // Trabajo de campo / inspección en distrito o terreno
  | 'notificacion_usuario'     // Notificación oficial de reclamo al domicilio del usuario
  | 'audiencia_conciliacion'   // Sala de audiencias de conciliación AETN/ODECO
  | 'archivo_expedientes'      // Búsqueda de antecedentes en archivo central
  | 'tramite_aetn_gerencia'    // Entrega de informe regulatorio a AETN o Gerencia General
  | 'permiso_particular';      // Permiso personal de fuerza mayor debidamente avisado

export interface CategoryMeta {
  label: string;
  shortLabel: string;
  description: string;
  isOfficialCommission: boolean;
  defaultMinutes: number;
  badgeClass: string;
  noTimeLimit?: boolean;
}

export const LEAVE_CATEGORIES_CONFIG: Record<LeaveCategory, CategoryMeta> = {
  salida_bano: {
    label: 'Salida al Baño (Servicios Higiénicos)',
    shortLabel: 'Baño / SS.HH.',
    description: 'Salida a servicios higiénicos (sin límite de tiempo fijado).',
    isOfficialCommission: false,
    defaultMinutes: 0,
    noTimeLimit: true,
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800',
  },
  notificacion_usuario: {
    label: 'Notificación de Reclamo a Usuario',
    shortLabel: 'Notificación',
    description: 'Entrega formal de resolución o citación al reclamante en domicilio.',
    isOfficialCommission: true,
    defaultMinutes: 45,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  },
  inspeccion_campo: {
    label: 'Trabajo de Campo / Comisión a Distrito',
    shortLabel: 'Campo / Distrito',
    description: 'Verificación técnica o gestión en distrito o terreno.',
    isOfficialCommission: true,
    defaultMinutes: 60,
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
  },
  audiencia_conciliacion: {
    label: 'Audiencia de Conciliación Reclamante',
    shortLabel: 'Audiencia',
    description: 'Participación en sala de audiencias con el usuario y la distribuidora.',
    isOfficialCommission: true,
    defaultMinutes: 60,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
  },
  archivo_expedientes: {
    label: 'Búsqueda en Archivo de Expedientes',
    shortLabel: 'Archivo Central',
    description: 'Revisión y desarchivo de documentación física de reclamaciones históricas.',
    isOfficialCommission: true,
    defaultMinutes: 20,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  },
  tramite_aetn_gerencia: {
    label: 'Gestión Institucional / AETN / Gerencia',
    shortLabel: 'Gestión AETN',
    description: 'Remisión de informes trimestrales y notas de descargo ante la autoridad reguladora.',
    isOfficialCommission: true,
    defaultMinutes: 30,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  },
  refrigerio_reglamentario: {
    label: 'Refrigerio / Almuerzo Reglamentario',
    shortLabel: 'Refrigerio',
    description: 'Tiempo de descanso normado durante la jornada continua (08:00 a 16:00).',
    isOfficialCommission: false,
    defaultMinutes: 30,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  },
  permiso_particular: {
    label: 'Permiso Particular de Urgencia',
    shortLabel: 'Permiso',
    description: 'Asunto de fuerza mayor o trámite particular debidamente comunicado al encargado.',
    isOfficialCommission: false,
    defaultMinutes: 30,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
  },
};

export interface ContactCenterSchedule {
  shiftName: string; // ej. "Turno Mañana (07:30 - 15:30)"
  startTime: string; // "07:30"
  endTime: string;   // "15:30"
  lunchBreakTime: string; // "12:00 - 12:30 (30 min)"
  activeDays: string; // "Lunes a Viernes"
  notes?: string;
  lastUpdated?: string;
}

export interface ContactCenterMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'supervisor' | 'contact_center';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface StaffMember {
  id: string;
  fullName: string;
  role: string;
  deskIdentifier: string;
  phoneExtension: string;
  mobileContact?: string;
  status: StaffStatus;
  currentLeaveId?: string;
  assignedShift: string; // ej. "08:00 - 16:00"
  avatarInitials: string;
  deskPosition: number; // 1, 2, 3...
  isProvidingQueueSupport?: boolean;
  department?: 'plataforma' | 'contact_center' | 'jefatura' | 'legal' | 'tecnica';
  contactCenterSchedule?: ContactCenterSchedule;
}

export interface QueueHelpAlert {
  id: string;
  triggeredByStaffId: string;
  triggeredByStaffName: string;
  deskIdentifier: string;
  severity: 'moderada' | 'alta' | 'critica';
  estimatedWaitingUsers: number;
  message: string;
  timestamp: string; // HH:mm:ss
  status: 'active' | 'attending' | 'resolved';
  respondedByStaffIds: string[];
  resolvedAt?: string;
}

export interface LeaveRecord {
  id: string;
  staffId: string;
  staffName: string;
  deskIdentifier: string;
  role: string;
  category: LeaveCategory;
  destination: string;
  caseNumber?: string; // Ej. "REC-AETN-8041"
  caseSubject?: string; // Ej. "Reclamo por cobro excesivo - Usuario Morales"
  departureTime: string; // HH:mm
  estimatedReturnTime: string; // HH:mm
  actualReturnTime?: string; // HH:mm
  departureDate: string; // YYYY-MM-DD
  isOverdue: boolean;
  overdueMinutes: number;
  justificationNotes?: string;
  supervisorNotes?: string;
  registeredBy: 'staff' | 'supervisor';
  status: 'active' | 'completed';
}

export interface ODECOCase {
  code: string;
  consumerName: string;
  matter: string;
  assignedToStaffId: string;
  status: 'en_tramite' | 'notificado' | 'en_inspeccion';
}

// Módulo de Solicitudes y Horas Extras
export type StaffRequestType = 'horas_extras' | 'compensacion' | 'vacaciones' | 'medica' | 'personalizada';

export interface CustomFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'time' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
}

export interface CustomFormTemplate {
  id: string;
  code: string; // Ej. "FOR-ODE-01"
  title: string;
  description: string;
  type: StaffRequestType;
  isCustom: boolean;
  createdAt: string;
  fields: CustomFormField[];
}

export interface StaffRequestDoc {
  id: string;
  templateId: string;
  requestCode: string; // Ej. "SOL-HE-2026-001"
  requestType: StaffRequestType;
  title: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  deskIdentifier: string;
  requestDate: string;
  status: 'pendiente' | 'visado_encargado' | 'aprobado_final';
  // Common details
  justification: string;
  // Dynamic or specific data
  specificData: {
    // Horas extras
    extraHoursDate?: string;
    extraHoursStart?: string;
    extraHoursEnd?: string;
    totalExtraHours?: number;
    tasksPerformed?: string;
    caseReference?: string;
    // Compensación
    accumulatedHours?: number;
    compensationDate?: string;
    compensationHours?: number;
    // Vacaciones
    vacationStart?: string;
    vacationEnd?: string;
    totalWorkingDays?: number;
    managementPeriod?: string;
    replacementStaffName?: string;
    // Médica
    medicalCenter?: string;
    certificateNumber?: string;
    medicalLeaveDays?: number;
    medicalStart?: string;
    medicalEnd?: string;
    medicalNotes?: string;
    // Custom fields values
    customFields?: Record<string, string>;
  };
  // Official signatures block: Jefe de Depto, Encargado Diego Casillas, Gerente Comercial
  signatures: {
    solicitante: {
      name: string;
      role: string;
      signed: boolean;
      signedDate?: string;
    };
    encargadoReclamos: {
      name: string;
      title: string; // "Encargado de Reclamos ODECO"
      signed: boolean;
      signedDate?: string;
      observations?: string;
    };
    jefeDepartamento: {
      name: string;
      title: string; // "Jefe de Departamento de Atención al Cliente"
      signed: boolean;
      signedDate?: string;
      observations?: string;
    };
    gerenteComercial: {
      name: string;
      title: string; // "Gerente Comercial"
      signed: boolean;
      signedDate?: string;
      observations?: string;
    };
  };
}

