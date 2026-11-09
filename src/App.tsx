import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Users, 
  UserCheck, 
  FileText,
  Lock,
  KeyRound,
  FileSpreadsheet,
  QrCode,
  Wifi
} from 'lucide-react';
import { 
  StaffMember, 
  LeaveRecord, 
  ODECOCase, 
  LeaveCategory, 
  QueueHelpAlert,
  CustomFormTemplate,
  StaffRequestDoc,
  ContactCenterMessage,
  ContactCenterSchedule
} from './types/odeco';
import { INITIAL_STAFF, INITIAL_LEAVES, INITIAL_CASES, INITIAL_CONTACT_MESSAGES } from './data/initialData';
import { INITIAL_TEMPLATES, INITIAL_REQUESTS } from './data/initialTemplates';
import { HeaderNav, NavTabType } from './components/HeaderNav';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { StaffDeskView } from './components/StaffDeskView';
import { StaffRequestsModule } from './components/StaffRequestsModule';
import { ContactCenterModule } from './components/ContactCenterModule';
import { LeaveModal } from './components/LeaveModal';
import { OfficialReportModal } from './components/OfficialReportModal';
import { AETNNormativeModal } from './components/AETNNormativeModal';
import { QueueAlertBanner } from './components/QueueAlertBanner';
import { StaffManageModal } from './components/StaffManageModal';
import { SupervisorLoginModal } from './components/SupervisorLoginModal';
import { AddCustomFormModal } from './components/AddCustomFormModal';
import { FillRequestModal } from './components/FillRequestModal';
import { PrintableRequestDoc } from './components/PrintableRequestDoc';
import { ShareAccessModal } from './components/ShareAccessModal';
import { StationIdentifyModal } from './components/StationIdentifyModal';
import { getCurrentFullTimeString, getCurrentTimeString } from './utils/timeUtils';
import {
  fetchRemoteState,
  apiCreateLeave,
  apiReturnLeave,
  apiTriggerAlert,
  apiRespondAlert,
  apiResolveAlert,
  apiCreateRequest,
  apiSignRequest,
  apiDeleteRequest,
  apiCreateTemplate,
  apiAddStaff,
  apiUpdateStaff,
  apiDeleteStaff,
  apiUpdatePin,
  apiResetData,
  apiSendContactMessage,
  apiUpdateContactSchedule,
  apiMarkContactMessagesRead
} from './services/apiSync';

const STORAGE_STAFF_KEY = 'odeco_control_staff_v1';
const STORAGE_LEAVES_KEY = 'odeco_control_leaves_v1';
const STORAGE_CASES_KEY = 'odeco_control_cases_v1';
const STORAGE_ALERT_KEY = 'odeco_queue_alert_v1';
const STORAGE_AUTH_KEY = 'odeco_supervisor_auth_v1';
const STORAGE_PIN_KEY = 'odeco_supervisor_pin_v1';
const STORAGE_TEMPLATES_KEY = 'odeco_custom_templates_v1';
const STORAGE_REQUESTS_KEY = 'odeco_staff_requests_v1';
const STORAGE_STATION_KEY = 'odeco_device_station_id';
const STORAGE_CONTACT_MSGS_KEY = 'odeco_contact_center_msgs_v1';

export default function App() {
  // Live clock
  const [currentTimeFull, setCurrentTimeFull] = useState<string>(getCurrentFullTimeString());
  const [currentTimeShort, setCurrentTimeShort] = useState<string>(getCurrentTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeFull(getCurrentFullTimeString(now));
      setCurrentTimeShort(getCurrentTimeString(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Supervisor PIN and Authentication
  const [supervisorPin, setSupervisorPin] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_PIN_KEY) || '1234';
    } catch {
      return '1234';
    }
  });

  const [isSupervisorAuthenticated, setIsSupervisorAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Station Identification / Device binding state
  const [currentStaffId, setCurrentStaffId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_STATION_KEY) || 'staff-2';
    } catch {
      return 'staff-2';
    }
  });

  const [isStationModalOpen, setIsStationModalOpen] = useState<boolean>(() => {
    // If not authenticated as Diego Casillas and device doesn't have a station saved, show identify modal
    try {
      const hasSavedStation = localStorage.getItem(STORAGE_STATION_KEY);
      const isSupervisor = localStorage.getItem(STORAGE_AUTH_KEY) === 'true';
      return !hasSavedStation && !isSupervisor;
    } catch {
      return false;
    }
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Unified State
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STAFF_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [leavesList, setLeavesList] = useState<LeaveRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEAVES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_LEAVES;
    } catch {
      return INITIAL_LEAVES;
    }
  });

  const [casesList, setCasesList] = useState<ODECOCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CASES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CASES;
    } catch {
      return INITIAL_CASES;
    }
  });

  const [activeQueueAlert, setActiveQueueAlert] = useState<QueueHelpAlert | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALERT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [templatesList, setTemplatesList] = useState<CustomFormTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TEMPLATES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
    } catch {
      return INITIAL_TEMPLATES;
    }
  });

  const [requestsList, setRequestsList] = useState<StaffRequestDoc[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REQUESTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [contactCenterMessages, setContactCenterMessages] = useState<ContactCenterMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONTACT_MSGS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CONTACT_MESSAGES;
    } catch {
      return INITIAL_CONTACT_MESSAGES;
    }
  });

  // Local storage caching
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STAFF_KEY, JSON.stringify(staffList));
    } catch (e) {
      console.error(e);
    }
  }, [staffList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEAVES_KEY, JSON.stringify(leavesList));
    } catch (e) {
      console.error(e);
    }
  }, [leavesList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TEMPLATES_KEY, JSON.stringify(templatesList));
    } catch (e) {
      console.error(e);
    }
  }, [templatesList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(requestsList));
    } catch (e) {
      console.error(e);
    }
  }, [requestsList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONTACT_MSGS_KEY, JSON.stringify(contactCenterMessages));
    } catch (e) {
      console.error(e);
    }
  }, [contactCenterMessages]);

  useEffect(() => {
    try {
      if (activeQueueAlert) {
        localStorage.setItem(STORAGE_ALERT_KEY, JSON.stringify(activeQueueAlert));
      } else {
        localStorage.removeItem(STORAGE_ALERT_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeQueueAlert]);

  // Real-time Cloud Synchronization Loop (Multi-Device Sync)
  useEffect(() => {
    let isMounted = true;

    const syncWithServer = async () => {
      const remote = await fetchRemoteState();
      if (remote && isMounted) {
        setStaffList(remote.staffList);
        setLeavesList(remote.leavesList);
        setCasesList(remote.casesList);
        setTemplatesList(remote.templatesList);
        setRequestsList(remote.requestsList);
        setActiveQueueAlert(remote.activeQueueAlert);
        if (remote.supervisorPin) {
          setSupervisorPin(remote.supervisorPin);
        }
        if (remote.contactCenterMessages && Array.isArray(remote.contactCenterMessages)) {
          setContactCenterMessages(remote.contactCenterMessages);
        }
      }
    };

    syncWithServer(); // Initial fetch
    const interval = setInterval(syncWithServer, 2500); // Poll every 2.5s for live updates

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTabType>(() => {
    return isSupervisorAuthenticated ? 'supervisor' : 'staff';
  });
  
  // Device simulation toggle (PC vs Mobile view)
  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(false);

  // Modals state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [leaveModalStaffId, setLeaveModalStaffId] = useState<string | undefined>(undefined);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Staff Management Modal State
  const [isStaffManageModalOpen, setIsStaffManageModalOpen] = useState<boolean>(false);
  const [staffManageEditId, setStaffManageEditId] = useState<string | null>(null);

  // Form & Requests Modals
  const [isAddFormatModalOpen, setIsAddFormatModalOpen] = useState<boolean>(false);
  const [isFillModalOpen, setIsFillModalOpen] = useState<boolean>(false);
  const [fillModalInitialTemplateId, setFillModalInitialTemplateId] = useState<string | undefined>(undefined);
  const [isPrintableDocOpen, setIsPrintableDocOpen] = useState<boolean>(false);
  const [selectedPrintableRequest, setSelectedPrintableRequest] = useState<StaffRequestDoc | null>(null);

  // Supervisor Authentication Handlers
  const handleSuccessLogin = () => {
    setIsSupervisorAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_AUTH_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
    setActiveTab('supervisor');
  };

  const handleLogoutSupervisor = () => {
    setIsSupervisorAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    } catch (e) {
      console.error(e);
    }
    setActiveTab('staff');
  };

  const handleUpdatePin = (newPin: string) => {
    setSupervisorPin(newPin);
    try {
      localStorage.setItem(STORAGE_PIN_KEY, newPin);
    } catch (e) {
      console.error(e);
    }
    apiUpdatePin(newPin);
  };

  const handleSelectStation = (staffId: string) => {
    setCurrentStaffId(staffId);
    try {
      localStorage.setItem(STORAGE_STATION_KEY, staffId);
    } catch (e) {
      console.error(e);
    }
    setActiveTab('staff');
  };

  // Handlers for leaves
  const handleOpenLeaveModal = (staffId?: string) => {
    setLeaveModalStaffId(staffId || currentStaffId);
    setIsLeaveModalOpen(true);
  };

  const handleCreateLeave = (data: {
    staffId: string;
    category: LeaveCategory;
    destination: string;
    caseNumber?: string;
    caseSubject?: string;
    departureTime: string;
    estimatedReturnTime: string;
    justificationNotes?: string;
  }) => {
    const targetStaff = staffList.find((s) => s.id === data.staffId);
    if (!targetStaff) return;

    const newLeaveId = `leave-${Date.now()}`;
    const newLeave: LeaveRecord = {
      id: newLeaveId,
      staffId: data.staffId,
      staffName: targetStaff.fullName,
      deskIdentifier: targetStaff.deskIdentifier,
      role: targetStaff.role,
      category: data.category,
      destination: data.destination,
      caseNumber: data.caseNumber,
      caseSubject: data.caseSubject,
      departureTime: data.departureTime,
      estimatedReturnTime: data.estimatedReturnTime,
      departureDate: new Date().toISOString().slice(0, 10),
      isOverdue: false,
      overdueMinutes: 0,
      justificationNotes: data.justificationNotes,
      registeredBy: 'staff',
      status: 'active',
    };

    const newStatus = (data.category === 'refrigerio_reglamentario' || data.category === 'salida_bano') ? 'break' : 'on_mission';
    const updatedStaff = staffList.map((s) =>
      s.id === data.staffId
        ? { ...s, status: newStatus as any, currentLeaveId: newLeaveId, isProvidingQueueSupport: false }
        : s
    );

    setLeavesList([newLeave, ...leavesList]);
    setStaffList(updatedStaff);

    // Sync to cloud
    apiCreateLeave(newLeave, newStatus);
  };

  const handleConfirmReturn = (leaveId: string, notes?: string) => {
    const returnTime = getCurrentTimeString();
    const targetLeave = leavesList.find((l) => l.id === leaveId);
    if (!targetLeave) return;

    const updatedLeaves = leavesList.map((l) => {
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

    const updatedStaff = staffList.map((s) => {
      if (s.id === targetLeave.staffId) {
        return {
          ...s,
          status: 'at_desk' as const,
          currentLeaveId: undefined,
        };
      }
      return s;
    });

    setLeavesList(updatedLeaves);
    setStaffList(updatedStaff);

    // Sync to cloud
    apiReturnLeave(leaveId, returnTime, notes);
  };

  // Queue Help Alert Handlers
  const handleTriggerQueueAlert = (data: {
    triggeredByStaffId: string;
    severity: 'moderada' | 'alta' | 'critica';
    estimatedWaitingUsers: number;
    message: string;
  }) => {
    const staff = staffList.find((s) => s.id === data.triggeredByStaffId);
    const newAlert: QueueHelpAlert = {
      id: `alert-${Date.now()}`,
      triggeredByStaffId: data.triggeredByStaffId,
      triggeredByStaffName: staff?.fullName || 'Ventanilla de Informaciones',
      deskIdentifier: staff?.deskIdentifier || 'Informaciones y Orientación',
      severity: data.severity,
      estimatedWaitingUsers: data.estimatedWaitingUsers,
      message: data.message,
      timestamp: getCurrentTimeString(),
      status: 'active',
      respondedByStaffIds: [],
    };
    setActiveQueueAlert(newAlert);
    apiTriggerAlert(newAlert);
  };

  const handleRespondQueueAlert = (alertId: string, staffId: string) => {
    if (!activeQueueAlert || activeQueueAlert.id !== alertId) return;
    const isAlreadyResponding = activeQueueAlert.respondedByStaffIds.includes(staffId);
    const updatedResponded = isAlreadyResponding
      ? activeQueueAlert.respondedByStaffIds.filter((id) => id !== staffId)
      : [...activeQueueAlert.respondedByStaffIds, staffId];

    setActiveQueueAlert({
      ...activeQueueAlert,
      status: updatedResponded.length > 0 ? 'attending' : 'active',
      respondedByStaffIds: updatedResponded,
    });

    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, isProvidingQueueSupport: !isAlreadyResponding }
          : s
      )
    );
    apiRespondAlert(staffId);
  };

  const handleResolveQueueAlert = (alertId: string) => {
    if (!activeQueueAlert) return;
    setActiveQueueAlert(null);
    setStaffList((prev) =>
      prev.map((s) => ({ ...s, isProvidingQueueSupport: false }))
    );
    apiResolveAlert();
  };

  const handleToggleQueueSupport = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, isProvidingQueueSupport: !s.isProvidingQueueSupport }
          : s
      )
    );
    if (activeQueueAlert) {
      apiRespondAlert(staffId);
    }
  };

  const handleSelectStaffForDetail = (staffId: string) => {
    setCurrentStaffId(staffId);
    setActiveTab('staff');
  };

  // Staff Management Handlers
  const handleOpenStaffManageModal = (staffId?: string) => {
    setStaffManageEditId(staffId || null);
    setIsStaffManageModalOpen(true);
  };

  const handleAddStaff = (newStaffData: Omit<StaffMember, 'id' | 'status' | 'currentLeaveId'>) => {
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      status: 'at_desk',
      ...newStaffData,
    };
    setStaffList((prev) => [...prev, newStaff]);
    apiAddStaff(newStaff);
  };

  const handleUpdateStaff = (id: string, updatedData: Partial<StaffMember>) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
    if (updatedData.fullName) {
      setLeavesList((prev) =>
        prev.map((l) => (l.staffId === id ? { ...l, staffName: updatedData.fullName! } : l))
      );
    }
    apiUpdateStaff(id, updatedData);
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (currentStaffId === id && remaining.length > 0) {
        setCurrentStaffId(remaining[0].id);
      }
      return remaining;
    });
    apiDeleteStaff(id);
  };

  // Format and Request Handlers
  const handleAddTemplate = (newTemplate: CustomFormTemplate) => {
    setTemplatesList((prev) => [...prev, newTemplate]);
    apiCreateTemplate(newTemplate);
  };

  const handleOpenFillModal = (templateId?: string) => {
    setFillModalInitialTemplateId(templateId);
    setIsFillModalOpen(true);
  };

  const handleCreateRequest = (newDoc: StaffRequestDoc, printImmediately: boolean) => {
    setRequestsList((prev) => [newDoc, ...prev]);
    apiCreateRequest(newDoc);
    if (printImmediately) {
      setSelectedPrintableRequest(newDoc);
      setIsPrintableDocOpen(true);
    }
  };

  const handleSignRequestAsSupervisor = (requestId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setRequestsList((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'visado_encargado' as const,
            signatures: {
              ...req.signatures,
              encargadoReclamos: {
                name: 'Lic. Diego Casillas',
                title: 'Encargado de Reclamos ODECO',
                signed: true,
                signedDate: today,
                observations: 'Visado conforme a normativa laboral y operativa ODECO.',
              },
            },
          };
        }
        return req;
      })
    );

    if (selectedPrintableRequest && selectedPrintableRequest.id === requestId) {
      setSelectedPrintableRequest((prev) =>
        prev
          ? {
              ...prev,
              status: 'visado_encargado' as const,
              signatures: {
                ...prev.signatures,
                encargadoReclamos: {
                  name: 'Lic. Diego Casillas',
                  title: 'Encargado de Reclamos ODECO',
                  signed: true,
                  signedDate: today,
                  observations: 'Visado conforme a normativa laboral y operativa ODECO.',
                },
              },
            }
          : null
      );
    }

    apiSignRequest(requestId, today, 'Visado conforme a normativa laboral y operativa ODECO.');
  };

  const handleDeleteRequest = (requestId: string) => {
    if (window.confirm('¿Desea eliminar este registro de solicitud?')) {
      setRequestsList((prev) => prev.filter((r) => r.id !== requestId));
      if (selectedPrintableRequest?.id === requestId) {
        setIsPrintableDocOpen(false);
      }
      apiDeleteRequest(requestId);
    }
  };

  const handleViewAndPrintRequest = (request: StaffRequestDoc) => {
    setSelectedPrintableRequest(request);
    setIsPrintableDocOpen(true);
  };

  const handleSendContactMessage = (msg: ContactCenterMessage) => {
    setContactCenterMessages((prev) => [...prev, msg]);
    apiSendContactMessage(msg);
  };

  const handleUpdateContactSchedule = (staffId: string, schedule: ContactCenterSchedule) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              department: 'contact_center' as const,
              contactCenterSchedule: schedule,
              assignedShift: `${schedule.startTime} - ${schedule.endTime} (${schedule.shiftName})`,
            }
          : s
      )
    );
    apiUpdateContactSchedule(staffId, schedule);
  };

  const handleMarkContactMessagesRead = () => {
    const readerRole = isSupervisorAuthenticated ? 'supervisor' : 'contact_center';
    setContactCenterMessages((prev) =>
      prev.map((m) => (m.senderRole !== readerRole ? { ...m, read: true } : m))
    );
    apiMarkContactMessagesRead(readerRole);
  };

  const unreadContactCount = contactCenterMessages.filter(
    (m) => !m.read && m.senderRole !== (isSupervisorAuthenticated ? 'supervisor' : 'contact_center')
  ).length;

  const handleResetData = () => {
    if (window.confirm('¿Deseas restaurar los datos iniciales de funcionarios, formularios y solicitudes de ODECO en todos los dispositivos?')) {
      localStorage.removeItem(STORAGE_STAFF_KEY);
      localStorage.removeItem(STORAGE_LEAVES_KEY);
      localStorage.removeItem(STORAGE_CASES_KEY);
      localStorage.removeItem(STORAGE_ALERT_KEY);
      localStorage.removeItem(STORAGE_AUTH_KEY);
      localStorage.removeItem(STORAGE_PIN_KEY);
      localStorage.removeItem(STORAGE_TEMPLATES_KEY);
      localStorage.removeItem(STORAGE_REQUESTS_KEY);
      localStorage.removeItem(STORAGE_STATION_KEY);
      localStorage.removeItem(STORAGE_CONTACT_MSGS_KEY);
      setStaffList(INITIAL_STAFF);
      setLeavesList(INITIAL_LEAVES);
      setCasesList(INITIAL_CASES);
      setTemplatesList(INITIAL_TEMPLATES);
      setRequestsList(INITIAL_REQUESTS);
      setContactCenterMessages(INITIAL_CONTACT_MESSAGES);
      setActiveQueueAlert(null);
      setIsSupervisorAuthenticated(false);
      setSupervisorPin('1234');
      setCurrentStaffId('staff-2');
      setActiveTab('staff');
      apiResetData();
    }
  };

  const currentStaffObj = staffList.find((s) => s.id === currentStaffId) || staffList[0];
  const pendingVisasCount = requestsList.filter((r) => !r.signatures.encargadoReclamos.signed).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      
      {/* Top Navbar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'contact_center') {
            handleMarkContactMessagesRead();
          }
        }}
        currentTimeString={currentTimeFull}
        isMobileDeviceView={isMobileDeviceView}
        setIsMobileDeviceView={setIsMobileDeviceView}
        staffName={currentStaffObj ? currentStaffObj.fullName : 'Funcionario'}
        isSupervisorAuthenticated={isSupervisorAuthenticated}
        onOpenSupervisorLogin={() => setIsLoginModalOpen(true)}
        onLogoutSupervisor={handleLogoutSupervisor}
        pendingRequestsCount={pendingVisasCount}
        contactCenterUnreadCount={unreadContactCount}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenStationModal={() => setIsStationModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 py-3 sm:py-6 px-2.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Queue Help Banner (Botón de Auxilio de Fila) */}
        <QueueAlertBanner
          activeAlert={activeQueueAlert}
          currentStaffId={currentStaffId}
          staffList={staffList}
          onTriggerAlert={handleTriggerQueueAlert}
          onRespondAlert={handleRespondQueueAlert}
          onResolveAlert={handleResolveQueueAlert}
        />

        {isMobileDeviceView ? (
          /* Simulated Smartphone Frame */
          <div className="flex flex-col items-center justify-center py-2">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>Vista en Teléfono Celular (Pantalla Táctil Ergonómica)</span>
              </span>
              <p className="text-[11px] text-slate-400">
                {isSupervisorAuthenticated ? 'Panel de Jefatura de Lic. Diego Casillas' : 'Panel de Funcionario Dependiente ODECO'}
              </p>
            </div>

            <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 border-[8px] border-slate-800 dark:border-slate-700 rounded-[38px] shadow-2xl overflow-hidden p-4 min-h-[680px] relative">
              {/* Phone Speaker Notch */}
              <div className="w-28 h-4 bg-slate-800 dark:bg-slate-700 rounded-b-xl mx-auto -mt-4 mb-3 flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-600 rounded-full"></div>
              </div>

              {activeTab === 'supervisor' && (
                isSupervisorAuthenticated ? (
                  <SupervisorDashboard
                    staffList={staffList}
                    leavesList={leavesList}
                    casesList={casesList}
                    currentTimeString={currentTimeShort}
                    onOpenLeaveModal={handleOpenLeaveModal}
                    onConfirmReturn={handleConfirmReturn}
                    onOpenReportModal={() => setIsReportModalOpen(true)}
                    onSelectStaffForDetail={handleSelectStaffForDetail}
                    onOpenStaffManageModal={handleOpenStaffManageModal}
                    onNavigateToRequests={() => setActiveTab('requests')}
                    onNavigateToContactCenter={() => {
                      setActiveTab('contact_center');
                      handleMarkContactMessagesRead();
                    }}
                    onOpenShareModal={() => setIsShareModalOpen(true)}
                  />
                ) : (
                  <div className="p-6 text-center space-y-4 my-8">
                    <Lock className="w-12 h-12 text-amber-500 mx-auto" />
                    <h3 className="text-base font-bold">Panel Exclusivo de Lic. Diego Casillas</h3>
                    <p className="text-xs text-slate-500">
                      Este panel está reservado para la jefatura. Ingresa con tu PIN para desbloquearlo.
                    </p>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                    >
                      Ingresar con PIN de Encargado
                    </button>
                  </div>
                )
              )}

              {activeTab === 'requests' && (
                <StaffRequestsModule
                  templates={templatesList}
                  requests={requestsList}
                  staffList={staffList}
                  isSupervisor={isSupervisorAuthenticated}
                  currentStaffId={currentStaffId}
                  onOpenAddFormatModal={() => setIsAddFormatModalOpen(true)}
                  onOpenFillModal={handleOpenFillModal}
                  onViewAndPrint={handleViewAndPrintRequest}
                  onSignAsSupervisor={handleSignRequestAsSupervisor}
                  onDeleteRequest={handleDeleteRequest}
                />
              )}

              {activeTab === 'contact_center' && (
                <ContactCenterModule
                  staffList={staffList}
                  currentStaffId={currentStaffId}
                  isSupervisor={isSupervisorAuthenticated}
                  messages={contactCenterMessages}
                  onSendMessage={handleSendContactMessage}
                  onUpdateSchedule={handleUpdateContactSchedule}
                  onMarkMessagesRead={handleMarkContactMessagesRead}
                />
              )}

              {activeTab === 'staff' && (
                <StaffDeskView
                  currentStaffId={currentStaffId}
                  setCurrentStaffId={setCurrentStaffId}
                  staffList={staffList}
                  leavesList={leavesList}
                  casesList={casesList}
                  currentTimeString={currentTimeShort}
                  activeQueueAlert={activeQueueAlert}
                  onOpenLeaveModal={handleOpenLeaveModal}
                  onConfirmReturn={handleConfirmReturn}
                  onToggleQueueSupport={handleToggleQueueSupport}
                  isSupervisorAuthenticated={isSupervisorAuthenticated}
                  onOpenSupervisorLogin={() => setIsLoginModalOpen(true)}
                  onNavigateToRequests={() => setActiveTab('requests')}
                  onNavigateToContactCenter={() => {
                    setActiveTab('contact_center');
                    handleMarkContactMessagesRead();
                  }}
                  onCreateLeave={handleCreateLeave}
                />
              )}

              {activeTab === 'report' && (
                isSupervisorAuthenticated ? (
                  <div className="space-y-4 text-center py-6">
                    <FileText className="w-10 h-10 text-blue-600 mx-auto" />
                    <h3 className="text-sm font-bold">Parte Oficial para Superiores</h3>
                    <p className="text-xs text-slate-500">
                      Generar el parte oficial en formato ejecutivo firmado por el Lic. Diego Casillas para elevar a gerencia y AETN.
                    </p>
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
                    >
                      Abrir Informe Oficial
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-4 my-8">
                    <Lock className="w-12 h-12 text-amber-500 mx-auto" />
                    <h3 className="text-base font-bold">Reportes Restringidos a Jefatura</h3>
                    <p className="text-xs text-slate-500">
                      Solo el Encargado Lic. Diego Casillas tiene acceso a generar y firmar informes para superiores.
                    </p>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                    >
                      Desbloquear con PIN
                    </button>
                  </div>
                )
              )}

              {activeTab === 'normative' && (
                <AETNNormativeModal />
              )}
            </div>
          </div>
        ) : (
          /* Normal Full Desktop View */
          <>
            {activeTab === 'supervisor' && (
              isSupervisorAuthenticated ? (
                <SupervisorDashboard
                  staffList={staffList}
                  leavesList={leavesList}
                  casesList={casesList}
                  currentTimeString={currentTimeShort}
                  onOpenLeaveModal={handleOpenLeaveModal}
                  onConfirmReturn={handleConfirmReturn}
                  onOpenReportModal={() => setIsReportModalOpen(true)}
                  onSelectStaffForDetail={handleSelectStaffForDetail}
                  onOpenStaffManageModal={handleOpenStaffManageModal}
                  onNavigateToRequests={() => setActiveTab('requests')}
                  onNavigateToContactCenter={() => {
                    setActiveTab('contact_center');
                    handleMarkContactMessagesRead();
                  }}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                />
              ) : (
                /* Locked State for Dependents */
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-md mx-auto space-y-4 shadow-sm my-10">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 mx-auto flex items-center justify-center text-amber-600">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                      Área Restringida · Jefatura de Reclamos ODECO
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      Panel Exclusivo del Lic. Diego Casillas
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Este panel contiene la supervisión integral de todo el personal, administración de puestos y emisión de partes para la gerencia. 
                      Los funcionarios dependientes deben ingresar a su propio <strong>Panel de Escritorio / Ventanilla</strong>.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm transition-all"
                    >
                      Ingresar con PIN de Encargado (Diego Casillas)
                    </button>
                    <button
                      onClick={() => setActiveTab('staff')}
                      className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                    >
                      Ir a Mi Panel de Dependiente
                    </button>
                  </div>
                </div>
              )
            )}

            {activeTab === 'requests' && (
              <StaffRequestsModule
                templates={templatesList}
                requests={requestsList}
                staffList={staffList}
                isSupervisor={isSupervisorAuthenticated}
                currentStaffId={currentStaffId}
                onOpenAddFormatModal={() => setIsAddFormatModalOpen(true)}
                onOpenFillModal={handleOpenFillModal}
                onViewAndPrint={handleViewAndPrintRequest}
                onSignAsSupervisor={handleSignRequestAsSupervisor}
                onDeleteRequest={handleDeleteRequest}
              />
            )}

            {activeTab === 'contact_center' && (
              <ContactCenterModule
                staffList={staffList}
                currentStaffId={currentStaffId}
                isSupervisor={isSupervisorAuthenticated}
                messages={contactCenterMessages}
                onSendMessage={handleSendContactMessage}
                onUpdateSchedule={handleUpdateContactSchedule}
                onMarkMessagesRead={handleMarkContactMessagesRead}
              />
            )}

            {activeTab === 'staff' && (
              <StaffDeskView
                currentStaffId={currentStaffId}
                setCurrentStaffId={setCurrentStaffId}
                staffList={staffList}
                leavesList={leavesList}
                casesList={casesList}
                currentTimeString={currentTimeShort}
                activeQueueAlert={activeQueueAlert}
                onOpenLeaveModal={handleOpenLeaveModal}
                onConfirmReturn={handleConfirmReturn}
                onToggleQueueSupport={handleToggleQueueSupport}
                isSupervisorAuthenticated={isSupervisorAuthenticated}
                onOpenSupervisorLogin={() => setIsLoginModalOpen(true)}
                onNavigateToRequests={() => setActiveTab('requests')}
                onNavigateToContactCenter={() => {
                  setActiveTab('contact_center');
                  handleMarkContactMessagesRead();
                }}
                onCreateLeave={handleCreateLeave}
              />
            )}

            {activeTab === 'report' && (
              isSupervisorAuthenticated ? (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 mx-auto flex items-center justify-center text-blue-600">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Generador de Parte Diario Oficial ODECO
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                        Emisión formal del estado de ventanillas y justificación de comisiones de servicio para la Jefatura Superior y cumplimiento de la normativa AETN.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Visualizar e Imprimir Parte Diario Oficial (Firmado por Diego Casillas)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-md mx-auto space-y-4 shadow-sm my-10">
                  <Lock className="w-12 h-12 text-amber-500 mx-auto" />
                  <h3 className="text-base font-bold">Reportes Restringidos al Encargado</h3>
                  <p className="text-xs text-slate-500">
                    La visualización y generación de partes oficiales requiere autorización del Lic. Diego Casillas con PIN.
                  </p>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Desbloquear con PIN de Encargado
                  </button>
                </div>
              )
            )}

            {activeTab === 'normative' && (
              <AETNNormativeModal />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 transition-colors no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Oficina de Defensa del Consumidor (ODECO)
            </span>
            <span className="text-slate-400">·</span>
            <span>Jornada Continua 08:00 a 16:00 · Encargado: Lic. Diego Casillas</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sincronizado en la Nube
            </span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
            >
              Conectar Dispositivos (QR)
            </button>
            <button
              onClick={handleResetData}
              title="Restaurar datos iniciales de funcionarios de prueba"
              className="flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar datos</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Departure Modal */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        staffList={staffList}
        casesList={casesList}
        defaultStaffId={leaveModalStaffId}
        isSupervisorMode={isSupervisorAuthenticated && activeTab === 'supervisor'}
        onSubmitLeave={handleCreateLeave}
      />

      {/* Official Printable Report Modal */}
      <OfficialReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        staffList={staffList}
        leavesList={leavesList}
        currentTimeString={currentTimeShort}
      />

      {/* Staff Management Modal (Añadir / Editar / Dar de baja Personal) */}
      <StaffManageModal
        isOpen={isStaffManageModalOpen}
        onClose={() => setIsStaffManageModalOpen(false)}
        staffList={staffList}
        onAddStaff={handleAddStaff}
        onUpdateStaff={handleUpdateStaff}
        onDeleteStaff={handleDeleteStaff}
        initialEditStaffId={staffManageEditId}
      />

      {/* Supervisor Private Access Login Modal */}
      <SupervisorLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccessLogin={handleSuccessLogin}
        savedPin={supervisorPin}
        onUpdatePin={handleUpdatePin}
      />

      {/* Add Custom Form Modal ("Añadir formato") */}
      <AddCustomFormModal
        isOpen={isAddFormatModalOpen}
        onClose={() => setIsAddFormatModalOpen(false)}
        onAddTemplate={handleAddTemplate}
        existingTemplatesCount={templatesList.length}
      />

      {/* Fill Request Modal */}
      <FillRequestModal
        isOpen={isFillModalOpen}
        onClose={() => setIsFillModalOpen(false)}
        templates={templatesList}
        staffList={staffList}
        initialTemplateId={fillModalInitialTemplateId}
        initialStaffId={currentStaffId}
        onSubmitRequest={handleCreateRequest}
      />

      {/* Official Printable Request Document Modal */}
      <PrintableRequestDoc
        isOpen={isPrintableDocOpen}
        onClose={() => setIsPrintableDocOpen(false)}
        request={selectedPrintableRequest}
        isSupervisor={isSupervisorAuthenticated}
        onSignAsSupervisor={handleSignRequestAsSupervisor}
      />

      {/* Share / Multi-Device Connection Modal */}
      <ShareAccessModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        staffCount={staffList.length}
      />

      {/* Station Identification Modal for First Entry */}
      <StationIdentifyModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        staffList={staffList}
        currentStaffId={currentStaffId}
        onSelectStation={handleSelectStation}
        onOpenSupervisorLogin={() => setIsLoginModalOpen(true)}
      />

    </div>
  );
}
