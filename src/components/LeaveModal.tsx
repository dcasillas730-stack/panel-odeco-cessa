import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Building, 
  Car, 
  Coffee, 
  AlertTriangle,
  FolderOpen,
  Briefcase
} from 'lucide-react';
import { LeaveCategory, LEAVE_CATEGORIES_CONFIG, StaffMember, ODECOCase } from '../types/odeco';
import { getCurrentTimeString, addMinutesToTimeString } from '../utils/timeUtils';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffMember[];
  casesList: ODECOCase[];
  defaultStaffId?: string;
  isSupervisorMode?: boolean;
  onSubmitLeave: (data: {
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

export const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  onClose,
  staffList,
  casesList,
  defaultStaffId,
  isSupervisorMode = false,
  onSubmitLeave,
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    defaultStaffId || (staffList.length > 0 ? staffList[0].id : '')
  );
  const [category, setCategory] = useState<LeaveCategory>('notificacion_usuario');
  const [destination, setDestination] = useState<string>('');
  const [selectedCaseCode, setSelectedCaseCode] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [justificationNotes, setJustificationNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentTime = getCurrentTimeString();
  const estimatedReturn = addMinutesToTimeString(currentTime, durationMinutes);
  const selectedStaff = staffList.find((s) => s.id === selectedStaffId);

  const quickDestinations = [
    'Servicios Higiénicos / Baño',
    'Comedor Institucional (Refrigerio)',
    'Trabajo de Campo - Distrito 1',
    'Trabajo de Campo - Distrito 2',
    'Trabajo de Campo - Distrito 3',
    'Zona Central - Inspección de Medidor',
    'Zona Norte - Notificación Reclamante',
    'Archivo Central de Expedientes (Sótano)',
    'Oficinas Regulador AETN',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setErrorMsg('Debes seleccionar el funcionario.');
      return;
    }
    if (!destination.trim()) {
      setErrorMsg('Por favor especifica el destino o ubicación a la que acude.');
      return;
    }

    const matchedCase = casesList.find((c) => c.code === selectedCaseCode);

    onSubmitLeave({
      staffId: selectedStaffId,
      category,
      destination: destination.trim(),
      caseNumber: selectedCaseCode || undefined,
      caseSubject: matchedCase?.matter,
      departureTime: currentTime,
      estimatedReturnTime: estimatedReturn,
      justificationNotes: justificationNotes.trim() || undefined,
    });

    onClose();
  };

  const handleCategoryChange = (cat: LeaveCategory) => {
    setCategory(cat);
    const meta = LEAVE_CATEGORIES_CONFIG[cat];
    setDurationMinutes(meta.defaultMinutes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isSupervisorMode ? 'Registrar Salida / Comisión de Personal' : 'Registrar Mi Salida de Oficina'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Coordinación interna de ventanilla ODECO y garantía de atención al usuario (AETN)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Funcionario Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Funcionario Dependiente
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.fullName} · {staff.deskIdentifier} ({staff.status === 'at_desk' ? 'En escritorio' : 'Actualmente fuera'})
                </option>
              ))}
            </select>
            {selectedStaff && (
              <span className="block text-[11px] text-slate-500 mt-1">
                Puesto asignado: {selectedStaff.deskIdentifier} · Turno {selectedStaff.assignedShift}
              </span>
            )}
          </div>

          {/* Categoría / Motivo Principal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Motivo o Categoría de la Salida
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(LEAVE_CATEGORIES_CONFIG) as LeaveCategory[]).map((catKey) => {
                const meta = LEAVE_CATEGORIES_CONFIG[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => handleCategoryChange(catKey)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {catKey === 'salida_bano' && <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                      {catKey === 'notificacion_usuario' && <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      {catKey === 'inspeccion_campo' && <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      {catKey === 'audiencia_conciliacion' && <Building className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                      {catKey === 'archivo_expedientes' && <FolderOpen className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                      {catKey === 'tramite_aetn_gerencia' && <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      {catKey === 'refrigerio_reglamentario' && <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      {catKey === 'permiso_particular' && <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      <span className="text-xs font-bold leading-tight line-clamp-1">{meta.shortLabel}</span>
                    </div>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {meta.isOfficialCommission ? 'Comisión oficial' : 'Receso normado'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Destino y Ubicación exacta */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Destino / Dirección Exacta <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ej. Av. Montes #120 - Notificación usuario o Archivo Sótano"
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Quick destination buttons */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {quickDestinations.map((qd) => (
                <button
                  type="button"
                  key={qd}
                  onClick={() => setDestination(qd)}
                  className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  {qd}
                </button>
              ))}
            </div>
          </div>

          {/* Trámite / Caso ODECO Asociado (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Código de Reclamo ODECO / AETN (Respaldo Oficial)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select
                value={selectedCaseCode}
                onChange={(e) => setSelectedCaseCode(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">(Sin código de reclamo específico / Trámite general)</option>
                {casesList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}: {c.consumerName} ({c.matter.slice(0, 45)}...)
                  </option>
                ))}
              </select>
            </div>
            <span className="block text-[10px] text-slate-500 mt-0.5">
              Vincular el reclamo certifica legalmente que la salida obedece a un expediente en curso ante la AETN.
            </span>
          </div>

          {/* Tiempo Previsto y Estimación */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tiempo Estimado de Salida:
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                Salida: {currentTime} ➔ Retorno estimado: {estimatedReturn} ({durationMinutes} min)
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[15, 30, 45, 60, 90, 120].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDurationMinutes(mins)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium font-mono tabular-nums transition-colors ${
                    durationMinutes === mins
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins} min`}
                </button>
              ))}
            </div>
          </div>

          {/* Notas u Observaciones */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observaciones o Detalles de la Comisión
            </label>
            <input
              type="text"
              value={justificationNotes}
              onChange={(e) => setJustificationNotes(e.target.value)}
              placeholder="Ej. Se lleva acta de inspección para firma del usuario reclamante"
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Salida Oficial</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
