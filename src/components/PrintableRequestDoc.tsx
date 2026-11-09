import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  Check, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Calendar, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  PenTool,
  Download
} from 'lucide-react';
import { StaffRequestDoc } from '../types/odeco';
import { formatDateSpanish } from '../utils/timeUtils';

interface PrintableRequestDocProps {
  isOpen: boolean;
  onClose: () => void;
  request: StaffRequestDoc | null;
  isSupervisor: boolean;
  onSignAsSupervisor?: (requestId: string) => void;
}

export const PrintableRequestDoc: React.FC<PrintableRequestDocProps> = ({
  isOpen,
  onClose,
  request,
  isSupervisor,
  onSignAsSupervisor,
}) => {
  const [signedAnim, setSignedAnim] = useState(false);

  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSign = () => {
    if (onSignAsSupervisor) {
      onSignAsSupervisor(request.id);
      setSignedAnim(true);
      setTimeout(() => setSignedAnim(false), 2000);
    }
  };

  const requestDateFormatted = formatDateSpanish(new Date(request.requestDate + 'T12:00:00'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        
        {/* Top Action Bar (no-print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 no-print shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
              {request.requestCode} · Formulario Oficial para Firma e Impresión
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isSupervisor && !request.signatures.encargadoReclamos.signed && onSignAsSupervisor && (
              <button
                onClick={handleSign}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Visar / Firmar (Lic. Diego Casillas)</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Formulario</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 print:text-black print:p-0">
          
          {/* Institutional Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                  ESTADO PLURINACIONAL DE BOLIVIA · SERVICIOS REGULADOS
                </span>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
                  Oficina de Defensa del Consumidor (ODECO)
                </h1>
                <p className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase">
                  {request.title}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Marco Regulatorio AETN · Tramitación Interna de Personal
                </p>
              </div>

              <div className="text-right text-xs font-mono shrink-0 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-300 dark:border-slate-700">
                <span className="block font-bold text-slate-900 dark:text-slate-100">
                  CÓDIGO: {request.requestCode}
                </span>
                <span className="block text-slate-500 text-[11px] mt-0.5">
                  FECHA: {request.requestDate}
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded font-bold text-[10px]">
                  {request.status === 'aprobado_final'
                    ? 'APROBADO'
                    : request.signatures.encargadoReclamos.signed
                    ? 'VISADO POR ENCARGADO'
                    : 'EN TRAMITACIÓN'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Staff Identification Data */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1">
              1. Datos del Funcionario Solicitante
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[11px] text-slate-500 block">Nombres y Apellidos:</span>
                <strong className="text-slate-900 dark:text-white text-sm">{request.staffName}</strong>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Cargo / Rol en ODECO:</span>
                <strong className="text-slate-900 dark:text-white">{request.staffRole}</strong>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Puesto / Ventanilla Asignada:</span>
                <strong className="text-slate-900 dark:text-white">{request.deskIdentifier}</strong>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Fecha de Presentación:</span>
                <strong className="text-slate-900 dark:text-white">{requestDateFormatted}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Specific Details Depending on Request Type */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1">
              2. Detalle y Fundamentación de la Solicitud
            </h3>

            {request.requestType === 'horas_extras' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Fecha de Realización:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{request.specificData.extraHoursDate || request.requestDate}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Hora Inicio:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{request.specificData.extraHoursStart || '16:00'}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Hora Conclusión:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{request.specificData.extraHoursEnd || '18:00'}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Horas Extras:</span>
                    <strong className="font-mono text-blue-700 dark:text-blue-300 text-sm">{request.specificData.totalExtraHours || 2} horas</strong>
                  </div>
                </div>

                {request.specificData.caseReference && (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-500 block">Expediente o Reclamo AETN Relacionado:</span>
                    <strong className="font-mono text-blue-700 dark:text-blue-300">{request.specificData.caseReference}</strong>
                  </div>
                )}

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Tareas Específicas Realizadas / Justificación Operativa:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {request.specificData.tasksPerformed || request.justification}
                  </p>
                </div>
              </div>
            )}

            {request.requestType === 'compensacion' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Horas Acumuladas Disponibles:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{request.specificData.accumulatedHours || 4} horas</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Fecha Solicitada de Compensación:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{request.specificData.compensationDate || request.requestDate}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Horas a Compensar:</span>
                    <strong className="font-mono text-amber-700 dark:text-amber-300 text-sm">{request.specificData.compensationHours || 2} horas</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Justificación y Antecedentes del Sobretiempo:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {request.specificData.tasksPerformed || request.justification}
                  </p>
                </div>
              </div>
            )}

            {request.requestType === 'vacaciones' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Gestión Laboral:</span>
                    <strong className="text-slate-900 dark:text-white">{request.specificData.managementPeriod || 'Gestión 2025-2026'}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Fecha de Inicio:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{request.specificData.vacationStart}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Fecha de Retorno:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{request.specificData.vacationEnd}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Días Hábiles:</span>
                    <strong className="font-mono text-emerald-700 dark:text-emerald-300 text-sm">{request.specificData.totalWorkingDays || 5} días</strong>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
                  <span className="text-[11px] text-slate-500 block">Garantía de Atención Continua AETN - Funcionario de Relevo Asignado:</span>
                  <strong className="text-blue-900 dark:text-blue-200 text-sm">
                    {request.specificData.replacementStaffName || 'Funcionario de Ventanilla Designado'}
                  </strong>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    El funcionario de relevo asume la recepción de usuarios en ventanilla durante el período vacacional.
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Plan de Entrega de Expedientes y Observaciones:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {request.specificData.tasksPerformed || request.justification}
                  </p>
                </div>
              </div>
            )}

            {request.requestType === 'medica' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900/50">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Entidad Médica:</span>
                    <strong className="text-slate-900 dark:text-white">{request.specificData.medicalCenter || 'Caja Nacional de Salud'}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Nº de Baja / Boleta:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{request.specificData.certificateNumber || 'BM-2026-001'}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Días de Baja:</span>
                    <strong className="font-mono text-rose-700 dark:text-rose-300 text-sm">{request.specificData.medicalLeaveDays || 1} día(s)</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Observaciones Médicas / Indicaciones de Reincorporación:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {request.specificData.medicalNotes || request.justification}
                  </p>
                </div>
              </div>
            )}

            {request.requestType === 'personalizada' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Datos del Formulario:
                  </span>
                  {request.specificData.customFields && Object.entries(request.specificData.customFields).map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60 last:border-b-0">
                      <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                      <strong className="text-slate-900 dark:text-white text-right">{v}</strong>
                    </div>
                  ))}
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-500 block">Fundamentación:</span>
                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{request.justification}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Section 3: Official Signatures Block (Requerido: Jefe de Departamento, Encargado de Reclamos Diego Casillas, Gerente Comercial) */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1">
              3. Instancias de Aprobación y Firmas Oficiales
            </h3>

            {/* 4 Signatures Grid: Solicitante + 3 Jefaturas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs pt-8 pb-4">
              
              {/* 1. Solicitante */}
              <div className="flex flex-col justify-between h-32 border-t-2 border-slate-400 dark:border-slate-600 pt-2 px-1">
                <div className="text-[10px] text-slate-400 font-mono italic">
                  [Firma Digital Registrada]
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-[11px]">{request.staffName}</strong>
                  <span className="block text-[10px] text-slate-500">{request.staffRole}</span>
                  <span className="block text-[9px] text-slate-400 font-semibold uppercase">Funcionario Solicitante</span>
                </div>
              </div>

              {/* 2. Encargado de Reclamos ODECO (Diego Casillas) */}
              <div className="flex flex-col justify-between h-32 border-t-2 border-slate-400 dark:border-slate-600 pt-2 px-1">
                <div className="text-[10px] text-slate-400 font-mono italic">
                  {request.signatures.encargadoReclamos.signed ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Visado Conforme
                    </span>
                  ) : (
                    <span>[Pendiente de Visado]</span>
                  )}
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-[11px]">Lic. Diego Casillas</strong>
                  <span className="block text-[10px] text-slate-500">Encargado de Reclamos ODECO</span>
                  <span className="block text-[9px] text-blue-700 dark:text-blue-400 font-semibold uppercase">Revisión y Conformidad</span>
                </div>
              </div>

              {/* 3. Jefe de Departamento */}
              <div className="flex flex-col justify-between h-32 border-t-2 border-slate-400 dark:border-slate-600 pt-2 px-1">
                <div className="text-[10px] text-slate-400 font-mono italic">
                  <span>[Espacio para Sello y Firma]</span>
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-[11px]">Jefe de Departamento</strong>
                  <span className="block text-[10px] text-slate-500">Atención al Cliente y ODECO</span>
                  <span className="block text-[9px] text-slate-400 font-semibold uppercase">Autorización Sectorial</span>
                </div>
              </div>

              {/* 4. Gerente Comercial */}
              <div className="flex flex-col justify-between h-32 border-t-2 border-slate-400 dark:border-slate-600 pt-2 px-1">
                <div className="text-[10px] text-slate-400 font-mono italic">
                  <span>[Espacio para Sello y Firma]</span>
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white text-[11px]">Gerente Comercial</strong>
                  <span className="block text-[10px] text-slate-500">Gerencia Comercial / Distribución</span>
                  <span className="block text-[9px] text-slate-400 font-semibold uppercase">Aprobación Final</span>
                </div>
              </div>

            </div>
          </div>

          {/* Institutional footer disclaimer */}
          <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            Formulario emitido a través del Sistema Integrado de Control Operativo ODECO · Sujeto a disposiciones laborales vigentes y Resoluciones Regulatorias AETN.
          </div>

        </div>

      </div>
    </div>
  );
};
