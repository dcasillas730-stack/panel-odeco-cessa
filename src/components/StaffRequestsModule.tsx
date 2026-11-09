import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  AlertCircle, 
  Search, 
  Filter, 
  Layers, 
  ShieldCheck, 
  FilePlus2, 
  PenTool, 
  Trash2, 
  Building2,
  Sparkles,
  ChevronRight,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  StaffMember, 
  CustomFormTemplate, 
  StaffRequestDoc, 
  StaffRequestType 
} from '../types/odeco';

interface StaffRequestsModuleProps {
  templates: CustomFormTemplate[];
  requests: StaffRequestDoc[];
  staffList: StaffMember[];
  isSupervisor: boolean;
  currentStaffId?: string;
  onOpenAddFormatModal: () => void;
  onOpenFillModal: (templateId?: string) => void;
  onViewAndPrint: (request: StaffRequestDoc) => void;
  onSignAsSupervisor: (requestId: string) => void;
  onDeleteRequest: (requestId: string) => void;
}

export const StaffRequestsModule: React.FC<StaffRequestsModuleProps> = ({
  templates,
  requests,
  staffList,
  isSupervisor,
  currentStaffId,
  onOpenAddFormatModal,
  onOpenFillModal,
  onViewAndPrint,
  onSignAsSupervisor,
  onDeleteRequest,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Type filter
      if (selectedTypeFilter !== 'all' && req.requestType !== selectedTypeFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === 'pendiente' && req.signatures.encargadoReclamos.signed) {
        return false;
      }
      if (statusFilter === 'visado' && !req.signatures.encargadoReclamos.signed) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = req.staffName.toLowerCase().includes(q);
        const matchCode = req.requestCode.toLowerCase().includes(q);
        const matchTitle = req.title.toLowerCase().includes(q);
        const matchDesk = req.deskIdentifier.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchTitle && !matchDesk) {
          return false;
        }
      }
      return true;
    });
  }, [requests, selectedTypeFilter, statusFilter, searchQuery]);

  // Quick stats
  const totalRequestsCount = requests.length;
  const pendingVisadoCount = requests.filter((r) => !r.signatures.encargadoReclamos.signed).length;
  const totalExtraHoursCount = requests
    .filter((r) => r.requestType === 'horas_extras')
    .reduce((acc, curr) => acc + (curr.specificData.totalExtraHours || 0), 0);
  const totalVacationDaysCount = requests
    .filter((r) => r.requestType === 'vacaciones')
    .reduce((acc, curr) => acc + (curr.specificData.totalWorkingDays || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Action Buttons */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider text-blue-200">
                Sistematización Digital ODECO
              </span>
              <span className="text-xs text-blue-300 font-mono">
                Horas Extras · Compensaciones · Vacaciones · Bajas Médicas
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Gestión de Formularios y Solicitudes de Personal
            </h1>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              Plataforma digital para la elaboración de solicitudes, control de sobretiempos, visado institucional y emisión de formularios impresos con pie de firmas oficial (Jefe de Depto., Encargado de Reclamos Lic. Diego Casillas y Gerente Comercial).
            </p>
          </div>

          {/* Action Buttons: Explicit "Añadir formato" requested by user */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={onOpenAddFormatModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FilePlus2 className="w-4 h-4 text-slate-950" />
              <span>Añadir Formato</span>
            </button>

            <button
              onClick={() => onOpenFillModal()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Llenar Solicitud</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Solicitudes</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalRequestsCount}
          </div>
          <div className="text-[11px] text-slate-400">
            Registradas en sistema
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Horas Extras</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalExtraHoursCount.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Sobretiempo solicitado
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Días Vacación</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {totalVacationDaysCount} <span className="text-xs font-normal text-slate-400">días</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Con relevo programado
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pendiente Visado</span>
            <PenTool className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {pendingVisadoCount}
          </div>
          <div className="text-[11px] text-slate-400">
            Esperando a Lic. Diego Casillas
          </div>
        </div>
      </div>

      {/* Formats / Templates Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Formatos Digitales Disponibles para Tramitación
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {templates.length} formatos activos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold text-[10px]">
                    {tmpl.code}
                  </span>
                  {tmpl.isCustom && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      Personalizado
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {tmpl.title}
                </h3>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {tmpl.description}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {tmpl.fields.length} campos
                </span>
                <button
                  onClick={() => onOpenFillModal(tmpl.id)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <span>Llenar Formato</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registered Requests Table Section */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Registro de Solicitudes Tramitadas y Estado de Firmas
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por funcionario, código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: 'Todas las Solicitudes' },
              { id: 'horas_extras', label: 'Horas Extras' },
              { id: 'compensacion', label: 'Compensaciones' },
              { id: 'vacaciones', label: 'Vacaciones' },
              { id: 'medica', label: 'Bajas Médicas' },
              { id: 'personalizada', label: 'Otros Formatos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedTypeFilter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">Todos los Estados</option>
              <option value="pendiente">Pendiente de Visado</option>
              <option value="visado">Visado por Lic. Casillas</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No se encontraron solicitudes con los filtros seleccionados
              </p>
              <p className="text-xs text-slate-400">
                Haga clic en "Llenar Solicitud" para registrar una nueva solicitud de horas extras, vacaciones o compensación.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Código / Fecha</th>
                    <th className="py-3 px-4">Tipo de Trámite</th>
                    <th className="py-3 px-4">Funcionario Solicitante</th>
                    <th className="py-3 px-4">Detalle / Cuantía</th>
                    <th className="py-3 px-4">Estado de Firmas</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRequests.map((req) => {
                    const isVisadoCasillas = req.signatures.encargadoReclamos.signed;

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        
                        {/* Código & Fecha */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-slate-200">
                          <span className="block text-blue-600 dark:text-blue-400">
                            {req.requestCode}
                          </span>
                          <span className="text-[11px] text-slate-400 font-sans">
                            {req.requestDate}
                          </span>
                        </td>

                        {/* Tipo de Trámite */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {req.title}
                          </span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">
                            {req.justification}
                          </span>
                        </td>

                        {/* Funcionario */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 font-bold flex items-center justify-center text-[10px]">
                              {req.staffName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong className="block text-slate-900 dark:text-white">
                                {req.staffName}
                              </strong>
                              <span className="text-[10px] text-slate-400">
                                {req.deskIdentifier}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Detalle / Cuantía */}
                        <td className="py-3.5 px-4 text-[11px]">
                          {req.requestType === 'horas_extras' && (
                            <span className="font-semibold text-amber-700 dark:text-amber-400">
                              {req.specificData.totalExtraHours} hrs extras ({req.specificData.extraHoursStart} - {req.specificData.extraHoursEnd})
                            </span>
                          )}
                          {req.requestType === 'compensacion' && (
                            <span className="font-semibold text-purple-700 dark:text-purple-400">
                              {req.specificData.compensationHours} hrs compensatorias ({req.specificData.compensationDate})
                            </span>
                          )}
                          {req.requestType === 'vacaciones' && (
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                              {req.specificData.totalWorkingDays} días hábiles (Relevo: {req.specificData.replacementStaffName})
                            </span>
                          )}
                          {req.requestType === 'medica' && (
                            <span className="font-semibold text-rose-700 dark:text-rose-400">
                              {req.specificData.medicalLeaveDays} día(s) ({req.specificData.medicalCenter})
                            </span>
                          )}
                          {req.requestType === 'personalizada' && (
                            <span className="text-slate-500">
                              Formulario personalizado
                            </span>
                          )}
                        </td>

                        {/* Estado de Firmas */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {isVisadoCasillas ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                <CheckCircle2 className="w-3 h-3" />
                                Visado por Lic. Casillas
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                                <Clock className="w-3 h-3" />
                                Pendiente de Visado
                              </span>
                            )}
                            <div className="text-[10px] text-slate-400">
                              Firmado por: {req.staffName}
                            </div>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Supervisor Visa Button */}
                            {isSupervisor && !isVisadoCasillas && (
                              <button
                                onClick={() => onSignAsSupervisor(req.id)}
                                title="Visar formalmente como Encargado de Reclamos Lic. Diego Casillas"
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-colors"
                              >
                                <PenTool className="w-3 h-3" />
                                <span>Visar</span>
                              </button>
                            )}

                            {/* View & Print Button */}
                            <button
                              onClick={() => onViewAndPrint(req)}
                              title="Ver documento oficial con pie de firmas para impresión"
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-[11px] transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Ver / Imprimir</span>
                            </button>

                            {/* Delete button (only if not signed by supervisor) */}
                            {(!isVisadoCasillas || isSupervisor) && (
                              <button
                                onClick={() => onDeleteRequest(req.id)}
                                title="Eliminar registro"
                                className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Institutional Regulatory Footnote */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
        <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            Circuito Administrativo de Solicitudes y Sobretasa AETN
          </span>
          <p className="leading-relaxed text-[11px]">
            Conforme al Reglamento de Atención de Reclamos Directos (RARD) y disposiciones de la AETN, toda jornada extraordinaria debe ser visada previamente por el <strong>Lic. Diego Casillas (Encargado de Reclamos ODECO)</strong> antes de su elevación a la Jefatura de Departamento y posterior visto bueno de la Gerencia Comercial para su consolidación en planilla o compensación horaria.
          </p>
        </div>
      </div>

    </div>
  );
};
