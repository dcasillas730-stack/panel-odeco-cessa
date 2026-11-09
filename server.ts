import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_STAFF, INITIAL_LEAVES, INITIAL_CASES, INITIAL_CONTACT_MESSAGES } from './src/data/initialData.ts';
import { INITIAL_TEMPLATES, INITIAL_REQUESTS } from './src/data/initialTemplates.ts';
import { StaffMember, LeaveRecord, ODECOCase, CustomFormTemplate, StaffRequestDoc, QueueHelpAlert, ContactCenterMessage, ContactCenterSchedule } from './src/types/odeco.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'odeco_store.json');

interface OdecoStore {
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

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory store cache
let store: OdecoStore;

function initStore(): OdecoStore {
  if (fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.staffList)) {
        if (!Array.isArray(parsed.contactCenterMessages)) {
          parsed.contactCenterMessages = INITIAL_CONTACT_MESSAGES;
        }
        // Ensure Contact Center staff exist in existing data
        INITIAL_STAFF.forEach((initStaff) => {
          if (!parsed.staffList.some((s: StaffMember) => s.id === initStaff.id)) {
            parsed.staffList.push(initStaff);
          }
        });
        return parsed;
      }
    } catch (e) {
      console.error('Error loading store, restoring default:', e);
    }
  }

  const defaultStore: OdecoStore = {
    staffList: INITIAL_STAFF,
    leavesList: INITIAL_LEAVES,
    casesList: INITIAL_CASES,
    templatesList: INITIAL_TEMPLATES,
    requestsList: INITIAL_REQUESTS,
    activeQueueAlert: null,
    supervisorPin: '1234',
    contactCenterMessages: INITIAL_CONTACT_MESSAGES,
    version: Date.now(),
  };

  saveStoreToFile(defaultStore);
  return defaultStore;
}

function saveStoreToFile(data: OdecoStore) {
  try {
    data.version = Date.now();
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing store to file:', e);
  }
}

store = initStore();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // 1. API: Get entire unified state
  app.get('/api/state', (req, res) => {
    res.json(store);
  });

  // 2. API: Reset store to institutional defaults
  app.post('/api/reset', (req, res) => {
    store = {
      staffList: INITIAL_STAFF,
      leavesList: INITIAL_LEAVES,
      casesList: INITIAL_CASES,
      templatesList: INITIAL_TEMPLATES,
      requestsList: INITIAL_REQUESTS,
      activeQueueAlert: null,
      supervisorPin: '1234',
      contactCenterMessages: INITIAL_CONTACT_MESSAGES,
      version: Date.now(),
    };
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 3. API: Create Leave / Departure
  app.post('/api/leaves/create', (req, res) => {
    const { leave, updatedStatus } = req.body;
    if (!leave || !leave.staffId) {
      return res.status(400).json({ error: 'Faltan datos de la comisión' });
    }

    store.leavesList = [leave, ...store.leavesList];
    store.staffList = store.staffList.map((s) =>
      s.id === leave.staffId
        ? { ...s, status: updatedStatus || 'on_mission', currentLeaveId: leave.id, isProvidingQueueSupport: false }
        : s
    );
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 4. API: Confirm Return from Leave
  app.post('/api/leaves/return', (req, res) => {
    const { leaveId, returnTime, notes } = req.body;
    const targetLeave = store.leavesList.find((l) => l.id === leaveId);
    if (!targetLeave) {
      return res.status(404).json({ error: 'Registro de salida no encontrado' });
    }

    store.leavesList = store.leavesList.map((l) => {
      if (l.id === leaveId) {
        return {
          ...l,
          actualReturnTime: returnTime,
          status: 'completed' as const,
          justificationNotes: notes ? `${l.justificationNotes || ''} · ${notes}` : l.justificationNotes,
        };
      }
      return l;
    });

    store.staffList = store.staffList.map((s) => {
      if (s.id === targetLeave.staffId) {
        return {
          ...s,
          status: 'at_desk' as const,
          currentLeaveId: undefined,
        };
      }
      return s;
    });

    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 5. API: Queue Help Alert Trigger
  app.post('/api/alert/trigger', (req, res) => {
    const { alert } = req.body;
    if (!alert) {
      return res.status(400).json({ error: 'Faltan datos de alerta' });
    }
    store.activeQueueAlert = alert;
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 6. API: Queue Help Alert Respond / Support
  app.post('/api/alert/respond', (req, res) => {
    const { staffId } = req.body;
    if (!store.activeQueueAlert) {
      return res.status(400).json({ error: 'No hay alerta activa' });
    }

    const isAlready = store.activeQueueAlert.respondedByStaffIds.includes(staffId);
    const updatedResponded = isAlready
      ? store.activeQueueAlert.respondedByStaffIds.filter((id) => id !== staffId)
      : [...store.activeQueueAlert.respondedByStaffIds, staffId];

    store.activeQueueAlert = {
      ...store.activeQueueAlert,
      status: updatedResponded.length > 0 ? 'attending' : 'active',
      respondedByStaffIds: updatedResponded,
    };

    store.staffList = store.staffList.map((s) =>
      s.id === staffId ? { ...s, isProvidingQueueSupport: !isAlready } : s
    );

    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 7. API: Queue Help Alert Resolve
  app.post('/api/alert/resolve', (req, res) => {
    store.activeQueueAlert = null;
    store.staffList = store.staffList.map((s) => ({ ...s, isProvidingQueueSupport: false }));
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 8. API: Staff Requests (Horas extras, vacaciones, compensación, médicas)
  app.post('/api/requests/create', (req, res) => {
    const { requestDoc } = req.body;
    if (!requestDoc || !requestDoc.id) {
      return res.status(400).json({ error: 'Faltan datos de la solicitud' });
    }
    store.requestsList = [requestDoc, ...store.requestsList];
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 9. API: Visa / Sign Request as Supervisor (Diego Casillas)
  app.post('/api/requests/sign', (req, res) => {
    const { requestId, signedDate, observations } = req.body;
    store.requestsList = store.requestsList.map((reqDoc) => {
      if (reqDoc.id === requestId) {
        return {
          ...reqDoc,
          status: 'visado_encargado' as const,
          signatures: {
            ...reqDoc.signatures,
            encargadoReclamos: {
              name: 'Lic. Diego Casillas',
              title: 'Encargado de Reclamos ODECO',
              signed: true,
              signedDate: signedDate || new Date().toISOString().slice(0, 10),
              observations: observations || 'Visado conforme a normativa laboral y operativa ODECO.',
            },
          },
        };
      }
      return reqDoc;
    });
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 10. API: Delete Request
  app.post('/api/requests/delete', (req, res) => {
    const { requestId } = req.body;
    store.requestsList = store.requestsList.filter((r) => r.id !== requestId);
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 11. API: Add Custom Form Template
  app.post('/api/templates/create', (req, res) => {
    const { template } = req.body;
    if (!template || !template.id) {
      return res.status(400).json({ error: 'Faltan datos del formato' });
    }
    store.templatesList = [...store.templatesList, template];
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 12. API: Staff CRUD
  app.post('/api/staff/add', (req, res) => {
    const { newStaff } = req.body;
    store.staffList = [...store.staffList, newStaff];
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  app.post('/api/staff/update', (req, res) => {
    const { id, updatedData } = req.body;
    store.staffList = store.staffList.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
    if (updatedData && updatedData.fullName) {
      store.leavesList = store.leavesList.map((l) =>
        l.staffId === id ? { ...l, staffName: updatedData.fullName } : l
      );
    }
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  app.post('/api/staff/delete', (req, res) => {
    const { id } = req.body;
    store.staffList = store.staffList.filter((s) => s.id !== id);
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 13. API: Supervisor PIN
  app.post('/api/supervisor/pin', (req, res) => {
    const { newPin } = req.body;
    if (newPin) {
      store.supervisorPin = newPin;
      saveStoreToFile(store);
    }
    res.json({ success: true, store });
  });

  // 14. API: Contact Center - Send Real-Time Message
  app.post('/api/contact-center/message', (req, res) => {
    const { message } = req.body;
    if (!message || !message.message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }
    store.contactCenterMessages = [...(store.contactCenterMessages || []), message];
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 15. API: Contact Center - Update Member Schedule
  app.post('/api/contact-center/schedule', (req, res) => {
    const { staffId, schedule } = req.body;
    if (!staffId || !schedule) {
      return res.status(400).json({ error: 'Datos de horario incompletos' });
    }
    store.staffList = store.staffList.map((s) =>
      s.id === staffId
        ? {
            ...s,
            department: 'contact_center' as const,
            contactCenterSchedule: schedule,
            assignedShift: `${schedule.startTime} - ${schedule.endTime} (${schedule.shiftName})`,
          }
        : s
    );
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // 16. API: Contact Center - Mark Messages Read
  app.post('/api/contact-center/messages/read', (req, res) => {
    const { readerRole } = req.body; // 'supervisor' | 'contact_center'
    store.contactCenterMessages = (store.contactCenterMessages || []).map((m) =>
      m.senderRole !== readerRole ? { ...m, read: true } : m
    );
    saveStoreToFile(store);
    res.json({ success: true, store });
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ODECO Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
