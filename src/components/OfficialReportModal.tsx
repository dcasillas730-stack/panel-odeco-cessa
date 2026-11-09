import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { StaffMember, LeaveRecord, LEAVE_CATEGORIES_CONFIG } from '../types/odeco';
import { formatDateSpanish, getCurrentFullTimeString } from '../utils/timeUtils';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffMember[];
  leavesList: LeaveRecord[];
  currentTimeString: string;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  isOpen,
  onClose,
  staffList,
  leavesList,
  currentTimeString,
}) => {
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const todayStr = formatDateSpanish(new Date());
  const reportTime = getCurrentFullTimeString(new Date());

  const totalStaff = staffList.length;
  const atDeskStaff = staffList.filter((s) => s.status === 'at_desk').length;
  const onMissionStaff = staffList.filter((s) => s.status === 'on_mission').length;
  const onBreakStaff = staffList.filter((s) => s.status === 'break').length;
  const coveragePercent = totalStaff > 0 ? Math.round((atDeskStaff / totalStaff) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  const generateTextSummary = () => {
    let text = `*PARTE DIARIO DE CONTROL OPERATIVO ODECO*\n`;
    text += `Fecha: ${todayStr} | Hora: ${currentTimeString}\n`;
    text += `Jornada Laboral: 08:00 a 16:00 | Normativa AETN\n`;
    text += `----------------------------------------\n`;
    text += `*RESUMEN DE COBERTURA DE ATENCIÓN:*\n`;
    text += `• Total Personal: ${totalStaff}\n`;
    text += `• En Escritorio / Ventanilla: ${atDeskStaff} (${coveragePercent}%)\n`;
    text += `• En Comisión Oficial de Campo: ${onMissionStaff}\n`;
    text += `• En Refrigerio Reglamentario: ${onBreakStaff}\n\n`;
    text += `*UBICACIÓN Y ESTADO DEL PERSONAL EN TIEMPO REAL:*\n`;

    staffList.forEach((staff) => {
      const activeLeave = leavesList.find((l) => l.staffId === staff.id && l.status === 'active');
      text += `\n👤 *${staff.fullName}* (${staff.deskIdentifier}):\n`;
      if (staff.status === 'at_desk') {
        text += `   Estado: EN ESCRITORIO (Disponible para usuarios)\n`;
      } else if (activeLeave) {
        const cat = LEAVE_CATEGORIES_CONFIG[activeLeave.category]?.shortLabel || 'Comisión';
        text += `   Estado: FUERA DE OFICINA [${cat}]\n`;
        text += `   Destino: ${activeLeave.destination}\n`;
        if (activeLeave.caseNumber) text += `   Caso ODECO: ${activeLeave.caseNumber}\n`;
        text += `   Horario: ${activeLeave.departureTime} ➔ Retorno est. ${activeLeave.estimatedReturnTime}\n`;
      }
    });

    text += `\n----------------------------------------\n`;
    text += `Emitido por: Encargado de Reclamos ODECO\n`;
    text += `Finalidad: Garantía de continuidad de atención a reclamantes y respaldo del trabajo de campo.`;
    return text;
  };

  const handleCopy = () => {
    const summary = generateTextSummary();
    navigator.clipboard.writeText(summary);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Actions (no-print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 no-print shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Vista Previa de Parte Oficial para la Jefatura Superior
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copiado al Portapapeles</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar para WhatsApp / Email</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Exportar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Body (Printable Area) */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 print:text-black print:p-0">
          
          {/* Institutional Official Header */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                  ESTADO PLURINACIONAL DE BOLIVIA · SERVICIOS REGULADOS
                </span>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                  Oficina de Defensa del Consumidor (ODECO)
                </h1>
                <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                  PARTE OFICIAL DE COBERTURA OPERATIVA, PRESENCIA EN VENTANILLAS Y DILIGENCIAS
                </p>
                <p className="text-[11px] text-slate-500">
                  Marco Regulatorio AETN · Garantía de Atención Continua a Reclamantes (08:00 a 16:00)
                </p>
              </div>

              <div className="text-right text-xs font-mono shrink-0 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="block font-bold text-slate-800 dark:text-slate-200">
                  FECHA: {new Date().toISOString().slice(0, 10)}
                </span>
                <span className="block text-slate-500 text-[11px]">
                  HORA EMISIÓN: {reportTime}
                </span>
                <span className="block text-blue-700 dark:text-blue-400 font-semibold text-[10px] mt-0.5">
                  TURNO: 08:00 - 16:00 CONTINUO
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary Metrics Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block">Personal Asignado:</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {totalStaff} funcionarios
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Ventanillas Activas:</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {atDeskStaff} ({coveragePercent}%)
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Comisiones en Terreno:</span>
              <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                {onMissionStaff} en campo
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Refrigerios Regulados:</span>
              <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                {onBreakStaff} en receso
              </span>
            </div>
          </div>

          {/* Nominal Real-Time Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              1. Estado Nominal y Ubicación en Tiempo Real del Personal Dependiente
            </h3>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Funcionario / Cargo</th>
                    <th className="py-2.5 px-3">Puesto ODECO</th>
                    <th className="py-2.5 px-3">Estado Actual</th>
                    <th className="py-2.5 px-3">Diligencia / Destino Oficial</th>
                    <th className="py-2.5 px-3 text-right">Horario Registrado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {staffList.map((staff) => {
                    const activeLeave = leavesList.find((l) => l.staffId === staff.id && l.status === 'active');
                    const categoryMeta = activeLeave ? LEAVE_CATEGORIES_CONFIG[activeLeave.category] : null;

                    return (
                      <tr key={staff.id} className="text-slate-800 dark:text-slate-200">
                        <td className="py-2.5 px-3 font-semibold">
                          <span>{staff.fullName}</span>
                          <span className="text-[10px] text-slate-500 block font-normal">{staff.role}</span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-400">
                          {staff.deskIdentifier}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {staff.status === 'at_desk' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {staff.isProvidingQueueSupport ? 'Ventanilla (Módulo Apoyo)' : 'En Ventanilla'}
                            </span>
                          ) : staff.status === 'on_mission' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              Comisión Oficial
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Refrigerio
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {activeLeave ? (
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white block">
                                [{categoryMeta?.shortLabel}] {activeLeave.destination}
                              </span>
                              {activeLeave.caseNumber && (
                                <span className="text-[10px] font-mono text-blue-600 block">
                                  Expediente: {activeLeave.caseNumber}
                                </span>
                              )}
                            </div>
                          ) : staff.isProvidingQueueSupport ? (
                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                              ✓ Módulo de Apoyo Habilitado: Orientando y descongestionando fila de informaciones
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500">
                              Atención directa y recepción continua de usuarios
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px] whitespace-nowrap">
                          {activeLeave ? (
                            <span>{activeLeave.departureTime} ➔ {activeLeave.estimatedReturnTime}</span>
                          ) : (
                            <span>Turno 08:00 - 16:00</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Diligencias Ejecutadas Hoy */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Detalle de Notificaciones, Inspecciones y Gestiones del Día ({leavesList.length})
            </h3>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2 px-3">Horario</th>
                    <th className="py-2 px-3">Funcionario</th>
                    <th className="py-2 px-3">Diligencia / Reclamo</th>
                    <th className="py-2 px-3">Destino</th>
                    <th className="py-2 px-3 text-right">Resultado / Retorno</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {leavesList.map((leave) => (
                    <tr key={leave.id}>
                      <td className="py-2 px-3 font-mono">
                        {leave.departureTime} ➔ {leave.actualReturnTime || leave.estimatedReturnTime}
                      </td>
                      <td className="py-2 px-3 font-semibold">{leave.staffName}</td>
                      <td className="py-2 px-3">
                        <span className="block font-medium">
                          {LEAVE_CATEGORIES_CONFIG[leave.category]?.shortLabel}
                        </span>
                        {leave.caseNumber && (
                          <span className="font-mono text-blue-600 block">{leave.caseNumber}</span>
                        )}
                      </td>
                      <td className="py-2 px-3">{leave.destination}</td>
                      <td className="py-2 px-3 text-right font-mono">
                        {leave.status === 'completed' ? (
                          <span className="text-emerald-700 font-semibold">Retornó {leave.actualReturnTime}</span>
                        ) : (
                          <span className="text-blue-700 font-semibold">En curso</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Certification and Anti-Harassment Statement */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            <h4 className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Certificación Legal y Garantía de Clima Laboral:</span>
            </h4>
            <p className="text-[11px] leading-relaxed">
              El presente parte diario se emite en cumplimiento estricto del mandato de continuidad del servicio de atención al público establecido por la <strong>Autoridad de Fiscalización de Electricidad y Tecnología Nuclear (AETN)</strong> y el Decreto Supremo Nº 27172. 
              El control interno tiene fines estrictamente organizativos de relevo de ventanillas y de respaldo oficial a los funcionarios en el ejercicio de comisiones externas, <strong>excluyendo formalmente cualquier modalidad de acoso, hostigamiento o persecución laboral</strong>, en apego a la Ley General del Trabajo y normativas conexas.
            </p>
          </div>

          {/* Official Signatures Block */}
          <div className="pt-8 pb-4 grid grid-cols-2 gap-10 text-center text-xs">
            <div className="border-t border-slate-400 dark:border-slate-600 pt-3">
              <span className="font-bold text-slate-900 dark:text-white block">Lic. Diego Casillas</span>
              <span className="text-slate-500 block">Encargado de Reclamos ODECO</span>
              <span className="text-[10px] text-slate-400 block">Responsable de Coordinación Interna</span>
            </div>

            <div className="border-t border-slate-400 dark:border-slate-600 pt-3">
              <span className="font-bold text-slate-900 dark:text-white block">Vo. Bo. Jefatura Superior</span>
              <span className="text-slate-500 block">Gerencia General / Dirección de Regulación</span>
              <span className="text-[10px] text-slate-400 block">Recepción y Conformidad</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
