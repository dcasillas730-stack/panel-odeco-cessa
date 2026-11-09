import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  Coffee, 
  AlertCircle, 
  PlusCircle, 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  FileText, 
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  Printer,
  Sparkles,
  UserPlus,
  Edit3,
  FileSpreadsheet,
  QrCode,
  Headphones
} from 'lucide-react';
import { StaffMember, LeaveRecord, LEAVE_CATEGORIES_CONFIG, ODECOCase } from '../types/odeco';
import { getLeaveTimingStatus, getCurrentTimeString } from '../utils/timeUtils';

interface SupervisorDashboardProps {
  staffList: StaffMember[];
  leavesList: LeaveRecord[];
  casesList: ODECOCase[];
  currentTimeString: string;
  onOpenLeaveModal: (staffId?: string) => void;
  onConfirmReturn: (leaveId: string, notes?: string) => void;
  onOpenReportModal: () => void;
  onSelectStaffForDetail: (staffId: string) => void;
  onOpenStaffManageModal: (staffId?: string) => void;
  onNavigateToRequests?: () => void;
  onNavigateToContactCenter?: () => void;
  onOpenShareModal?: () => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  staffList,
  leavesList,
  casesList,
  currentTimeString,
  onOpenLeaveModal,
  onConfirmReturn,
  onOpenReportModal,
  onSelectStaffForDetail,
  onOpenStaffManageModal,
  onNavigateToRequests,
  onNavigateToContactCenter,
  onOpenShareModal,
}) => {
  const [filterState, setFilterState] = useState<'all' | 'at_desk' | 'on_mission' | 'break' | 'delayed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active leaves map
  const activeLeavesMap = new Map<string, LeaveRecord>();
  leavesList
    .filter((l) => l.status === 'active')
    .forEach((l) => activeLeavesMap.set(l.staffId, l));

  // Compute metrics
  const totalStaff = staffList.length;
  const atDeskCount = staffList.filter((s) => s.status === 'at_desk').length;
  const onMissionCount = staffList.filter((s) => s.status === 'on_mission').length;
  const onBreakCount = staffList.filter((s) => s.status === 'break').length;

  // Compute delayed count in real-time (bathroom has NO time limit)
  let delayedCount = 0;
  staffList.forEach((staff) => {
    const activeLeave = activeLeavesMap.get(staff.id);
    if (activeLeave) {
      const isBathroom = activeLeave.category === 'salida_bano';
      const timing = getLeaveTimingStatus(
        activeLeave.departureTime, 
        activeLeave.estimatedReturnTime, 
        currentTimeString.slice(0, 5),
        isBathroom
      );
      if (timing.isOverdue) delayedCount++;
    }
  });

  const coveragePercentage = totalStaff > 0 ? Math.round((atDeskCount / totalStaff) * 100) : 0;
  const isAETNCompliant = coveragePercentage >= 60; // Estándar de cobertura de ventanilla

  // Filtered staff
  const filteredStaff = staffList.filter((staff) => {
    const activeLeave = activeLeavesMap.get(staff.id);
    const isBathroom = activeLeave?.category === 'salida_bano';
    const timing = activeLeave
      ? getLeaveTimingStatus(
          activeLeave.departureTime, 
          activeLeave.estimatedReturnTime, 
          currentTimeString.slice(0, 5),
          isBathroom
        )
      : null;

    if (filterState === 'at_desk' && staff.status !== 'at_desk') return false;
    if (filterState === 'on_mission' && staff.status !== 'on_mission') return false;
    if (filterState === 'break' && staff.status !== 'break') return false;
    if (filterState === 'delayed' && (!timing || !timing.isOverdue)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = staff.fullName.toLowerCase().includes(q);
      const matchDesk = staff.deskIdentifier.toLowerCase().includes(q);
      const matchRole = staff.role.toLowerCase().includes(q);
      const matchDest = activeLeave?.destination.toLowerCase().includes(q) || false;
      const matchCase = activeLeave?.caseNumber?.toLowerCase().includes(q) || false;
      return matchName || matchDesk || matchRole || matchDest || matchCase;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Institutional Mission Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-800/80 space-y-3.5">
        {/* Top: Full-width horizontal title & institutional badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-blue-800/60 pb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-blue-600/70 border border-blue-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-100" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                  Oficina de Defensa del Consumidor · ODECO
                </span>
                <span className="text-blue-400 hidden sm:inline">·</span>
                <span className="text-[11px] text-blue-300 font-medium hidden sm:inline">
                  Garantía Regulatoria AETN (08:00 - 16:00)
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight mt-0.5 whitespace-normal break-words">
                Control Interno de Presencia en Ventanillas y Diligencias Oficiales
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <span className="text-[11px] bg-blue-800/80 text-blue-100 px-2.5 py-1 rounded-md border border-blue-700/80 font-mono font-semibold">
              Encargado: Lic. Diego Casillas
            </span>
          </div>
        </div>

        {/* Bottom: Subtitle and action buttons in a separate clean row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <p className="text-xs text-blue-200/90 leading-relaxed max-w-xl">
            Supervisión directa de ventanillas y respaldo oficial del trabajo de campo bajo normativa AETN.
          </p>

          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <button
              onClick={() => onOpenLeaveModal()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Salida</span>
            </button>
            <button
              onClick={() => onOpenStaffManageModal()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              <UserPlus className="w-4 h-4 text-emerald-300" />
              <span>Personal ODECO</span>
            </button>
            {onNavigateToContactCenter && (
              <button
                onClick={onNavigateToContactCenter}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Headphones className="w-4 h-4 text-indigo-100" />
                <span>Contact Center</span>
              </button>
            )}
            {onNavigateToRequests && (
              <button
                onClick={onNavigateToRequests}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-slate-950" />
                <span>Horas Extras</span>
              </button>
            )}
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                title="Compartir enlace o código QR para que los dependientes conecten sus celulares y PCs"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
              >
                <QrCode className="w-4 h-4 text-emerald-100" />
                <span>Conectar QR</span>
              </button>
            )}
            <button
              onClick={onOpenReportModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              <Printer className="w-4 h-4 text-blue-200" />
              <span>Parte Oficial</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Strips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: At Desk / Ventanillas */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">En Ventanilla / Escritorio</span>
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {atDeskCount} <span className="text-sm font-normal text-slate-500">/ {totalStaff}</span>
            </span>
            <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
              isAETNCompliant 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              {coveragePercentage}% cobertura
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isAETNCompliant ? 'Cumple meta de atención AETN' : 'Alerta: Reforzar ventanillas'}
          </p>
        </div>

        {/* Metric 2: On Mission */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">En Comisión Oficial</span>
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
              {onMissionCount}
            </span>
            <span className="text-xs text-slate-500">personal en campo</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Notificaciones e inspecciones respaldadas
          </p>
        </div>

        {/* Metric 3: On Break */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Refrigerio Reglamentario</span>
            <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {onBreakCount}
            </span>
            <span className="text-xs text-slate-500">en receso normado</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Descanso de jornada continua
          </p>
        </div>

        {/* Metric 4: Delayed / Retrasos */}
        <div className={`bg-white dark:bg-slate-900 rounded-xl p-4 border shadow-xs transition-colors ${
          delayedCount > 0 
            ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20' 
            : 'border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Retrasos en Retorno</span>
            <AlertCircle className={`w-4 h-4 ${delayedCount > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${
              delayedCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
            }`}>
              {delayedCount}
            </span>
            <span className="text-xs text-slate-500">sobre tiempo previsto</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {delayedCount > 0 ? 'Requiere coordinación de relevo' : 'Todos en tiempo estimado'}
          </p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
        
        {/* Interactive Segmented Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg overflow-x-auto text-xs">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 font-semibold rounded-md whitespace-nowrap transition-colors ${
              filterState === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Todo el Equipo ({totalStaff})
          </button>
          <button
            onClick={() => setFilterState('at_desk')}
            className={`px-3 py-1.5 font-semibold rounded-md whitespace-nowrap transition-colors ${
              filterState === 'at_desk'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            En Escritorio ({atDeskCount})
          </button>
          <button
            onClick={() => setFilterState('on_mission')}
            className={`px-3 py-1.5 font-semibold rounded-md whitespace-nowrap transition-colors ${
              filterState === 'on_mission'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            En Comisión ({onMissionCount})
          </button>
          <button
            onClick={() => setFilterState('break')}
            className={`px-3 py-1.5 font-semibold rounded-md whitespace-nowrap transition-colors ${
              filterState === 'break'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Refrigerio ({onBreakCount})
          </button>
          {delayedCount > 0 && (
            <button
              onClick={() => setFilterState('delayed')}
              className={`px-3 py-1.5 font-semibold rounded-md whitespace-nowrap transition-colors ${
                filterState === 'delayed'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 hover:text-rose-700'
              }`}
            >
              Con Demora ({delayedCount})
            </button>
          )}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, puesto o caso..."
            className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-8 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid of Workstations and Desks */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Matriz de Ventanillas y Escritorios ODECO</span>
              <span className="text-xs font-normal text-slate-500">
                ({filteredStaff.length} funcionarios mostrados)
              </span>
            </h3>
            <button
              onClick={() => onOpenStaffManageModal()}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Añadir / Editar Personal</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Actualización continua en vivo · Horario 08:00 a 16:00
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => {
            const activeLeave = activeLeavesMap.get(staff.id);
            const isBathroom = activeLeave?.category === 'salida_bano';
            const timing = activeLeave
              ? getLeaveTimingStatus(
                  activeLeave.departureTime, 
                  activeLeave.estimatedReturnTime, 
                  currentTimeString.slice(0, 5),
                  isBathroom
                )
              : null;
            const categoryMeta = activeLeave ? LEAVE_CATEGORIES_CONFIG[activeLeave.category] : null;

            return (
              <div
                key={staff.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border p-4 transition-all hover:shadow-sm flex flex-col justify-between ${
                  timing?.isOverdue
                    ? 'border-rose-400 dark:border-rose-800 ring-1 ring-rose-400/50'
                    : staff.status === 'at_desk'
                    ? 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    : 'border-blue-200 dark:border-blue-900/60 bg-blue-50/10'
                }`}
              >
                <div>
                  {/* Card Header: Avatar + Name + Desk + Phone */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 shrink-0">
                        {staff.avatarInitials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {staff.fullName}
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block line-clamp-1">
                          {staff.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{staff.phoneExtension}</span>
                      </div>
                      <button
                        onClick={() => onOpenStaffManageModal(staff.id)}
                        title={`Editar funcionario (${staff.fullName})`}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Desk Identifier */}
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>{staff.deskIdentifier}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Turno {staff.assignedShift}</span>
                  </div>

                  {/* Status Box */}
                  {staff.status === 'at_desk' ? (
                    <div className={`p-3 rounded-lg border ${
                      staff.isProvidingQueueSupport
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 ring-1 ring-amber-400/70'
                        : 'bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${
                          staff.isProvidingQueueSupport
                            ? 'text-amber-800 dark:text-amber-200'
                            : 'text-emerald-800 dark:text-emerald-300'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            staff.isProvidingQueueSupport ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                          }`}></span>
                          {staff.isProvidingQueueSupport ? 'Módulo de Apoyo Activo' : 'Disponible en Ventanilla'}
                        </span>
                        <span className={`text-[10px] font-medium ${
                          staff.isProvidingQueueSupport
                            ? 'text-amber-700 dark:text-amber-300 font-bold'
                            : 'text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {staff.isProvidingQueueSupport ? 'Descongestionando Fila' : 'Atendiendo Reclamos'}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 ${
                        staff.isProvidingQueueSupport
                          ? 'text-amber-800/90 dark:text-amber-300 font-medium'
                          : 'text-emerald-700/80 dark:text-emerald-400/80'
                      }`}>
                        {staff.isProvidingQueueSupport 
                          ? 'Escritorio atendiendo usuarios de Informaciones para agilizar la fila.' 
                          : 'Puesto operativo para atención directa a consumidores.'}
                      </p>
                    </div>
                  ) : activeLeave ? (
                    <div className={`p-3 rounded-lg border space-y-2 ${
                      timing?.isOverdue
                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60'
                        : staff.status === 'break'
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60'
                        : 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50'
                    }`}>
                      {/* Category Label + Overdue Tag */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {categoryMeta?.shortLabel || 'Comisión Externa'}
                        </span>
                        {timing?.isOverdue ? (
                          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/80 px-1.5 py-0.5 rounded">
                            Demora: +{timing.overdueMinutes} min
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                            {timing?.formattedStatus}
                          </span>
                        )}
                      </div>

                      {/* Destination */}
                      <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-tight">{activeLeave.destination}</span>
                      </div>

                      {/* Associated Case Number */}
                      {activeLeave.caseNumber && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-blue-800 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                          <FileText className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">{activeLeave.caseNumber}</span>
                        </div>
                      )}

                      {/* Departure and Estimated Return Timestamps */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        <span>Salida: {activeLeave.departureTime}</span>
                        <span>Retorno est.: {activeLeave.estimatedReturnTime}</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Card Actions Bottom */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectStaffForDetail(staff.id)}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Ver Ficha</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {staff.status === 'at_desk' ? (
                    <button
                      onClick={() => onOpenLeaveModal(staff.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      Asignar Comisión
                    </button>
                  ) : activeLeave ? (
                    <button
                      onClick={() => onConfirmReturn(activeLeave.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Registrar Retorno</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Movement Bitacora Log */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Bitácora de Salidas y Diligencias del Día
            </h3>
            <p className="text-[11px] text-slate-500">
              Registro histórico cronológico para justificación formal y parte diario a la jefatura
            </p>
          </div>
          <button
            onClick={onOpenReportModal}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Ver Reporte Oficial Completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-4">Horario</th>
                <th className="py-2.5 px-4">Funcionario</th>
                <th className="py-2.5 px-4">Motivo / Categoría</th>
                <th className="py-2.5 px-4">Destino y Expediente</th>
                <th className="py-2.5 px-4">Estado / Retorno</th>
                <th className="py-2.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {leavesList.map((leave) => {
                const categoryMeta = LEAVE_CATEGORIES_CONFIG[leave.category];
                const isActive = leave.status === 'active';
                const timing = isActive
                  ? getLeaveTimingStatus(leave.departureTime, leave.estimatedReturnTime, currentTimeString.slice(0, 5))
                  : null;

                return (
                  <tr key={leave.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">
                      <span className="font-bold text-slate-900 dark:text-white">{leave.departureTime}</span>
                      <span className="text-slate-400 mx-1">➔</span>
                      <span>{leave.actualReturnTime || leave.estimatedReturnTime}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 dark:text-white block">{leave.staffName}</span>
                      <span className="text-[11px] text-slate-500">{leave.deskIdentifier}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded border ${categoryMeta?.badgeClass}`}>
                        {categoryMeta?.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="block font-medium text-slate-900 dark:text-white truncate">
                        {leave.destination}
                      </span>
                      {leave.caseNumber && (
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 block truncate">
                          Exp: {leave.caseNumber} {leave.caseSubject ? `· ${leave.caseSubject}` : ''}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isActive ? (
                        timing?.isOverdue ? (
                          <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 font-mono">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Demora: +{timing.overdueMinutes} min
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-medium font-mono">
                            En curso ({timing?.remainingMinutes}m rest.)
                          </span>
                        )
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 font-mono">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Retornó {leave.actualReturnTime}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isActive ? (
                        <button
                          onClick={() => onConfirmReturn(leave.id)}
                          className="px-2 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                        >
                          Marcar Retorno
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Concluido</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
