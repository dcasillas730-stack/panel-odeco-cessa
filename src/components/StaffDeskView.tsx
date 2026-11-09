import React, { useState } from 'react';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Car,
  Briefcase,
  Coffee,
  Building,
  Smartphone,
  ChevronDown,
  Info,
  Users,
  Lock,
  FileSpreadsheet,
  ArrowRight,
  Headphones,
  Send,
  Sparkles
} from 'lucide-react';
import { StaffMember, LeaveRecord, LEAVE_CATEGORIES_CONFIG, ODECOCase, QueueHelpAlert, LeaveCategory } from '../types/odeco';
import { getLeaveTimingStatus, getCurrentTimeString, addMinutesToTimeString } from '../utils/timeUtils';

interface StaffDeskViewProps {
  currentStaffId: string;
  setCurrentStaffId: (id: string) => void;
  staffList: StaffMember[];
  leavesList: LeaveRecord[];
  casesList: ODECOCase[];
  currentTimeString: string;
  activeQueueAlert?: QueueHelpAlert | null;
  onOpenLeaveModal: (staffId: string) => void;
  onConfirmReturn: (leaveId: string, notes?: string) => void;
  onToggleQueueSupport?: (staffId: string) => void;
  isSupervisorAuthenticated?: boolean;
  onOpenSupervisorLogin?: () => void;
  onNavigateToRequests?: () => void;
  onNavigateToContactCenter?: () => void;
  onCreateLeave?: (data: {
    staffId: string;
    category: LeaveCategory;
    destination: string;
    caseNumber?: string;
    caseSubject?: string;
    departureTime: string;
    estimatedReturnTime: string;
    justificationNotes?: string;
  }) => void;
}

export const StaffDeskView: React.FC<StaffDeskViewProps> = ({
  currentStaffId,
  setCurrentStaffId,
  staffList,
  leavesList,
  casesList,
  currentTimeString,
  activeQueueAlert,
  onOpenLeaveModal,
  onConfirmReturn,
  onToggleQueueSupport,
  isSupervisorAuthenticated = false,
  onOpenSupervisorLogin,
  onNavigateToRequests,
  onNavigateToContactCenter,
  onCreateLeave,
}) => {
  const [returnNote, setReturnNote] = useState<string>('');
  
  // Custom editable departure state
  const [customDestination, setCustomDestination] = useState<string>('');
  const [customMinutes, setCustomMinutes] = useState<number>(45);

  const currentStaff = staffList.find((s) => s.id === currentStaffId) || staffList[0];
  const activeLeave = leavesList.find((l) => l.staffId === currentStaff?.id && l.status === 'active');
  
  // Bathroom has NO time limit
  const isBathroomLeave = activeLeave?.category === 'salida_bano';

  const timing = activeLeave
    ? getLeaveTimingStatus(
        activeLeave.departureTime, 
        activeLeave.estimatedReturnTime, 
        currentTimeString.slice(0, 5),
        isBathroomLeave
      )
    : null;

  const categoryMeta = activeLeave ? LEAVE_CATEGORIES_CONFIG[activeLeave.category] : null;

  // Personal leaves today
  const myLeavesToday = leavesList.filter((l) => l.staffId === currentStaff?.id);

  // Quick Departure execution
  const executeDeparture = (category: LeaveCategory, destination: string, minutes: number) => {
    const depTime = getCurrentTimeString();
    // For bathroom, no fixed return time
    const retTime = minutes > 0 ? addMinutesToTimeString(depTime, minutes) : '--:--';

    if (onCreateLeave) {
      onCreateLeave({
        staffId: currentStaff.id,
        category,
        destination,
        departureTime: depTime,
        estimatedReturnTime: retTime,
      });
    } else {
      onOpenLeaveModal(currentStaff.id);
    }
    setCustomDestination('');
  };

  const handleReturnClick = () => {
    if (!activeLeave) return;
    onConfirmReturn(activeLeave.id, returnNote.trim() || undefined);
    setReturnNote('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      
      {/* Staff profile selector bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
            {currentStaff.avatarInitials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800 font-bold">
                {currentStaff.deskIdentifier}
              </span>
              <span className="text-[10px] text-slate-400">Jornada 08:00 - 16:00</span>
              {currentStaff.department === 'contact_center' && (
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded font-bold">
                  🎧 Contact Center
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate mt-0.5">
              {currentStaff.fullName}
            </h2>
            <span className="text-[11px] text-slate-500 truncate block">{currentStaff.role}</span>
          </div>
        </div>

        {/* Change staff switcher */}
        <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase sm:hidden">Puesto:</span>
          <select
            value={currentStaffId}
            onChange={(e) => setCurrentStaffId(e.target.value)}
            className="flex-1 sm:w-60 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.deskIdentifier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick unlock for Diego Casillas if not logged in */}
      {!isSupervisorAuthenticated && onOpenSupervisorLogin && (
        <div className="flex items-center justify-between px-3 py-2 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Encargado <strong>Lic. Diego Casillas</strong>:</span>
          </div>
          <button
            type="button"
            onClick={onOpenSupervisorLogin}
            className="text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:underline shrink-0"
          >
            Acceso con PIN →
          </button>
        </div>
      )}

      {/* If staff belongs to Contact Center, banner with quick access */}
      {currentStaff.department === 'contact_center' && onNavigateToContactCenter && (
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Headphones className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <strong className="text-indigo-950 dark:text-indigo-200 block">
                Operadora de la Oficina de Contact Center
              </strong>
              <span className="text-[11px] text-slate-500">
                Turno: {currentStaff.contactCenterSchedule?.shiftName || 'Turno Regular'} · Chat directo con Jefatura habilitado.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToContactCenter}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 transition-colors"
          >
            Abrir Contact Center →
          </button>
        </div>
      )}

      {/* Main Status Panel */}
      {currentStaff.status === 'at_desk' ? (
        /* ESTADO: EN ESCRITORIO / VENTANILLA */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 text-center space-y-4 shadow-sm">
          
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>En Ventanilla / Puesto Habilitado</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Atención Continua a Usuarios ODECO
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Tu presencia en <strong className="text-slate-700 dark:text-slate-300">{currentStaff.deskIdentifier}</strong> está confirmada y visible en tiempo real.
            </p>
          </div>

          {/* Salidas Principales: Baño (Sin tiempo) y Almuerzo/Refrigerio (30 min) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-left space-y-3">
            <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-center sm:text-left">
              Registrar Salida en 1 Solo Clic:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Botón 1: Salida al Baño (SIN LÍMITE DE TIEMPO) */}
              <button
                type="button"
                onClick={() => executeDeparture('salida_bano', 'Servicios Higiénicos / Baño', 0)}
                className="p-3.5 rounded-xl border-2 border-cyan-300 dark:border-cyan-800 bg-cyan-50/70 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50 text-left transition-all active:scale-[0.98] shadow-xs group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">🚾</span>
                  <span className="text-[10px] font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-200/80 dark:bg-cyan-900/80 px-2 py-0.5 rounded-md font-mono">
                    Sin límite de tiempo
                  </span>
                </div>
                <h4 className="text-sm font-black text-cyan-950 dark:text-cyan-100 leading-tight">
                  Salida al Baño (SS.HH.)
                </h4>
                <p className="text-[11px] text-cyan-800/80 dark:text-cyan-300 mt-0.5">
                  1 Clic directo · Sin cuenta regresiva ni límite
                </p>
              </button>

              {/* Botón 2: Almuerzo o Refrigerio (30 MINUTOS REGLAMENTARIOS) */}
              <button
                type="button"
                onClick={() => executeDeparture('refrigerio_reglamentario', 'Almuerzo / Refrigerio', 30)}
                className="p-3.5 rounded-xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50/70 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-left transition-all active:scale-[0.98] shadow-xs group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Coffee className="w-6 h-6 text-amber-600" />
                  <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 bg-amber-200/80 dark:bg-amber-900/80 px-2 py-0.5 rounded-md font-mono">
                    30 minutos normados
                  </span>
                </div>
                <h4 className="text-sm font-black text-amber-950 dark:text-amber-100 leading-tight">
                  Almuerzo / Refrigerio
                </h4>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300 mt-0.5">
                  1 Clic directo · 30 min de descanso reglamentario
                </p>
              </button>

            </div>

            {/* SECCIÓN: OTRAS SALIDAS (EDITABLE O DIRECTAMENTE SALIR) */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-indigo-600" />
                  <span>Otras Salidas / Campo / Distrito / Diligencia (Salida Directa o Editable)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Ocasional</span>
              </div>

              {/* Salida directa en 1 clic a distritos comunes */}
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block mb-1">
                  1 Clic para salir directamente a:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Distrito 1', min: 45 },
                    { label: 'Distrito 2', min: 45 },
                    { label: 'Distrito 3', min: 45 },
                    { label: 'Distrito 4', min: 45 },
                    { label: 'Zona Central', min: 30 },
                    { label: 'Archivo Central', min: 20 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => executeDeparture('inspeccion_campo', `Salida a ${item.label}`, item.min)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all active:scale-[0.98]"
                    >
                      {item.label} ({item.min}m)
                    </button>
                  ))}
                </div>
              </div>

              {/* O editar destino libremente antes de salir */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 font-semibold block mb-1">
                  O edita el lugar y tiempo específico antes de salir:
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    placeholder="Ej. Distrito 5, Inspección técnica o Notificación..."
                    className="flex-1 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-100"
                  />

                  <div className="flex items-center gap-1.5 shrink-0 justify-end">
                    {[30, 45, 60].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCustomMinutes(m)}
                        className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${
                          customMinutes === m
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const dest = customDestination.trim() || 'Salida en Comisión / Terreno';
                        executeDeparture('inspeccion_campo', dest, customMinutes);
                      }}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      Salir →
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Botón de apoyo de fila si está activa */}
            {onToggleQueueSupport && activeQueueAlert && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onToggleQueueSupport(currentStaff.id)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    currentStaff.isProvidingQueueSupport
                      ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700 shadow-sm'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-amber-500" />
                  <span>
                    {currentStaff.isProvidingQueueSupport
                      ? '✓ Mi Escritorio Está Apoyando la Fila (Desactivar)'
                      : 'Habilitar Mi Escritorio para Apoyar Fila de Informaciones'}
                  </span>
                </button>
              </div>
            )}

            {/* Acceso para el Encargado Diego Casillas o comisiones con expediente */}
            <div className="pt-2 text-center sm:text-right">
              <button
                type="button"
                onClick={() => onOpenLeaveModal(currentStaff.id)}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>¿Salida especial con número de reclamo o formulario formal? Abrir aquí →</span>
              </button>
            </div>

          </div>

        </div>
      ) : activeLeave ? (
        /* ESTADO: FUERA DE VENTANILLA (EN EL BAÑO, REFRIGERIO O CAMPO) */
        <div className={`rounded-2xl border p-4 sm:p-5 space-y-4 shadow-sm transition-colors ${
          timing?.isOverdue && !isBathroomLeave
            ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
            : isBathroomLeave
            ? 'bg-cyan-50/70 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-900'
            : activeLeave.category === 'refrigerio_reglamentario'
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900'
            : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900'
        }`}>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-2xl shadow-xs">
                {isBathroomLeave ? '🚾' : activeLeave.category === 'refrigerio_reglamentario' ? '☕' : '🚗'}
              </div>
              <div>
                <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase mb-0.5 ${categoryMeta?.badgeClass}`}>
                  {isBathroomLeave ? 'Servicios Higiénicos' : categoryMeta?.shortLabel || 'Salida'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {isBathroomLeave ? 'Salida al Baño (SS.HH.)' : activeLeave.destination}
                </h3>
              </div>
            </div>

            {/* Time status badge */}
            <div className="text-left sm:text-right">
              {isBathroomLeave ? (
                /* No time limit badge for bathroom */
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-900 text-white rounded-lg text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Sin límite de tiempo</span>
                </div>
              ) : timing?.isOverdue ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold font-mono">
                  <AlertCircle className="w-4 h-4" />
                  <span>Demora: +{timing.overdueMinutes} min</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white dark:bg-slate-800 rounded-lg text-xs font-bold font-mono">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{timing?.remainingMinutes} min restantes</span>
                </div>
              )}
            </div>
          </div>

          {/* Horarios de Salida y Retorno */}
          <div className="flex items-center justify-around bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Hora Salida:</span>
              <strong className="text-slate-800 dark:text-slate-200 text-sm">{activeLeave.departureTime}</strong>
            </div>
            <div className="text-slate-300">➔</div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">
                {isBathroomLeave ? 'Retorno:' : 'Retorno Estimado (30 min):'}
              </span>
              <strong className="text-slate-800 dark:text-slate-200 text-sm">
                {isBathroomLeave ? 'Al reincorporarse' : activeLeave.estimatedReturnTime}
              </strong>
            </div>
          </div>

          {/* Gran Botón de Retorno (1 solo clic) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleReturnClick}
              className="w-full min-h-[52px] rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span>✓ HE VUELTO (Reincorporarme a mi Ventanilla)</span>
            </button>
            <span className="block text-center text-[11px] text-slate-500 mt-1.5">
              1 Clic: el Encargado verá de inmediato tu ventanilla habilitada para atender usuarios.
            </span>
          </div>

        </div>
      ) : null}

      {/* Mis Salidas del Día (Historial limpio) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Mis Salidas Registradas Hoy ({myLeavesToday.length})
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">
            {new Date().toISOString().slice(0, 10)}
          </span>
        </div>

        {myLeavesToday.length === 0 ? (
          <div className="py-3 text-center text-xs text-slate-400">
            No tienes salidas registradas hoy. Tu presencia en ventanilla es continua.
          </div>
        ) : (
          <div className="space-y-1.5">
            {myLeavesToday.map((leave) => {
              const meta = LEAVE_CATEGORIES_CONFIG[leave.category];
              const isClosed = leave.status === 'completed';
              return (
                <div
                  key={leave.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${meta?.badgeClass}`}>
                      {meta?.shortLabel}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {leave.destination}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 shrink-0">
                    <span>{leave.departureTime} - {leave.actualReturnTime || (leave.category === 'salida_bano' ? 'SS.HH.' : leave.estimatedReturnTime)}</span>
                    {isClosed ? (
                      <span className="text-emerald-600 font-bold">✓ Listo</span>
                    ) : (
                      <span className="text-amber-600 font-bold">Activo</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enlace a Horas Extras y Formularios */}
      {onNavigateToRequests && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                Formularios de Horas Extras, Compensación y Vacaciones
              </h5>
              <span className="text-[11px] text-slate-500 block truncate">
                Llenado digital e impresión formal firmada por Jefatura.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToRequests}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0"
          >
            Abrir →
          </button>
        </div>
      )}

      {/* Nota sutil de control interno */}
      <p className="text-center text-[10px] text-slate-400">
        Control interno de ventanilla para relevos y respaldo laboral ODECO · Normativa AETN
      </p>

    </div>
  );
};
