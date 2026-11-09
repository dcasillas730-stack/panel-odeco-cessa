import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Printer, 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { 
  StaffMember, 
  CustomFormTemplate, 
  StaffRequestDoc, 
  StaffRequestType 
} from '../types/odeco';

interface FillRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: CustomFormTemplate[];
  staffList: StaffMember[];
  initialTemplateId?: string;
  initialStaffId?: string;
  onSubmitRequest: (newDoc: StaffRequestDoc, printImmediately: boolean) => void;
}

export const FillRequestModal: React.FC<FillRequestModalProps> = ({
  isOpen,
  onClose,
  templates,
  staffList,
  initialTemplateId,
  initialStaffId,
  onSubmitRequest,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId || (templates[0]?.id ?? ''));
  const [selectedStaffId, setSelectedStaffId] = useState(initialStaffId || (staffList[0]?.id ?? ''));
  const [justification, setJustification] = useState('');

  // Specific data for each type
  // Horas extras
  const [extraHoursDate, setExtraHoursDate] = useState(new Date().toISOString().slice(0, 10));
  const [extraHoursStart, setExtraHoursStart] = useState('16:00');
  const [extraHoursEnd, setExtraHoursEnd] = useState('18:30');
  const [totalExtraHours, setTotalExtraHours] = useState('2.5');
  const [caseReference, setCaseReference] = useState('');
  const [tasksPerformed, setTasksPerformed] = useState('');

  // Compensación
  const [accumulatedHours, setAccumulatedHours] = useState('4');
  const [compensationDate, setCompensationDate] = useState(new Date().toISOString().slice(0, 10));
  const [compensationHours, setCompensationHours] = useState('2');

  // Vacaciones
  const [managementPeriod, setManagementPeriod] = useState('Gestión 2025 - 2026');
  const [vacationStart, setVacationStart] = useState('');
  const [vacationEnd, setVacationEnd] = useState('');
  const [totalWorkingDays, setTotalWorkingDays] = useState('5');
  const [replacementStaffName, setReplacementStaffName] = useState('');

  // Médica
  const [medicalCenter, setMedicalCenter] = useState('Caja Nacional de Salud (CNS)');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [medicalLeaveDays, setMedicalLeaveDays] = useState('1');
  const [medicalStart, setMedicalStart] = useState(new Date().toISOString().slice(0, 10));
  const [medicalEnd, setMedicalEnd] = useState(new Date().toISOString().slice(0, 10));
  const [medicalNotes, setMedicalNotes] = useState('');

  // Custom fields mapping
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialTemplateId) {
      setSelectedTemplateId(initialTemplateId);
    }
  }, [initialTemplateId]);

  useEffect(() => {
    if (initialStaffId) {
      setSelectedStaffId(initialStaffId);
    }
  }, [initialStaffId]);

  if (!isOpen) return null;

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const currentStaff = staffList.find((s) => s.id === selectedStaffId) || staffList[0];

  const handleCustomFieldChange = (fieldId: string, val: string) => {
    setCustomFields((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleSubmit = (printImmediately: boolean) => {
    if (!currentTemplate || !currentStaff) return;

    // Generate Request Code
    const prefixMap: Record<StaffRequestType, string> = {
      horas_extras: 'SOL-HE',
      compensacion: 'SOL-COM',
      vacaciones: 'SOL-VAC',
      medica: 'SOL-MED',
      personalizada: 'SOL-DOC',
    };
    const prefix = prefixMap[currentTemplate.type] || 'SOL-DOC';
    const randomNum = Math.floor(100 + Math.random() * 900);
    const generatedCode = `${prefix}-2026-${randomNum}`;

    const newRequest: StaffRequestDoc = {
      id: `req-${Date.now()}`,
      templateId: currentTemplate.id,
      requestCode: generatedCode,
      requestType: currentTemplate.type,
      title: currentTemplate.title,
      staffId: currentStaff.id,
      staffName: currentStaff.fullName,
      staffRole: currentStaff.role,
      deskIdentifier: currentStaff.deskIdentifier,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'pendiente',
      justification: justification.trim() || tasksPerformed.trim() || 'Solicitud generada a través de formulario oficial ODECO.',
      specificData: {
        extraHoursDate,
        extraHoursStart,
        extraHoursEnd,
        totalExtraHours: Number(totalExtraHours) || 0,
        tasksPerformed: tasksPerformed.trim(),
        caseReference: caseReference.trim(),
        accumulatedHours: Number(accumulatedHours) || 0,
        compensationDate,
        compensationHours: Number(compensationHours) || 0,
        vacationStart,
        vacationEnd,
        totalWorkingDays: Number(totalWorkingDays) || 0,
        managementPeriod,
        replacementStaffName,
        medicalCenter,
        certificateNumber,
        medicalLeaveDays: Number(medicalLeaveDays) || 0,
        medicalStart,
        medicalEnd,
        medicalNotes,
        customFields,
      },
      signatures: {
        solicitante: {
          name: currentStaff.fullName,
          role: currentStaff.role,
          signed: true,
          signedDate: new Date().toISOString().slice(0, 10),
        },
        encargadoReclamos: {
          name: 'Lic. Diego Casillas',
          title: 'Encargado de Reclamos ODECO',
          signed: false,
        },
        jefeDepartamento: {
          name: 'Ing. Fernando Vaca Guzmán',
          title: 'Jefe de Departamento de Atención al Cliente y ODECO',
          signed: false,
        },
        gerenteComercial: {
          name: 'Lic. Marcelo Arze Quiroga',
          title: 'Gerente Comercial',
          signed: false,
        },
      },
    };

    onSubmitRequest(newRequest, printImmediately);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Llenado Digital de Solicitud / Formato ODECO
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete los datos requeridos. El documento generado incluirá firmas institucionales e impresión formal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Top selection: Template and Staff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/40">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Formato / Tipo de Trámite:</span>
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                {templates.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    [{tmpl.code}] {tmpl.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Funcionario Solicitante:</span>
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.deskIdentifier})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Template Info Card */}
          {currentTemplate && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white font-mono text-[11px] text-blue-700 dark:text-blue-300">
                  Código Oficial: {currentTemplate.code}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  {currentTemplate.isCustom ? 'Formato Personalizado Creado' : 'Formato Estándar ODECO'}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-1">
                {currentTemplate.description}
              </p>
            </div>
          )}

          {/* Form Fields Depending on Type */}

          {/* 1. HORAS EXTRAS */}
          {currentTemplate?.type === 'horas_extras' && (
            <div className="space-y-3 p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                Datos de la Jornada Extraordinaria
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Fecha Realización *</label>
                  <input
                    type="date"
                    required
                    value={extraHoursDate}
                    onChange={(e) => setExtraHoursDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Hora Inicio *</label>
                  <input
                    type="time"
                    required
                    value={extraHoursStart}
                    onChange={(e) => setExtraHoursStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Hora Fin *</label>
                  <input
                    type="time"
                    required
                    value={extraHoursEnd}
                    onChange={(e) => setExtraHoursEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Total Horas Extras *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    required
                    value={totalExtraHours}
                    onChange={(e) => setTotalExtraHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Expediente / Reclamo AETN Relacionado (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. REC-AETN-8041 (Cobro indebido) / Audiencia programada"
                  value={caseReference}
                  onChange={(e) => setCaseReference(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Tareas Específicas Realizadas y Fundamentación Operativa *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describa el trabajo perentorio realizado fuera de horario continuo para justificar el pago o compensación conforme a ley..."
                  value={tasksPerformed}
                  onChange={(e) => setTasksPerformed(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* 2. COMPENSACIÓN */}
          {currentTemplate?.type === 'compensacion' && (
            <div className="space-y-3 p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                Datos de Compensación de Sobretiempo
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Horas Acumuladas Disponibles</label>
                  <input
                    type="number"
                    value={accumulatedHours}
                    onChange={(e) => setAccumulatedHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Fecha a Compensar *</label>
                  <input
                    type="date"
                    required
                    value={compensationDate}
                    onChange={(e) => setCompensationDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Horas a Compensar en Jornada *</label>
                  <input
                    type="number"
                    value={compensationHours}
                    onChange={(e) => setCompensationHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Antecedentes de las Horas Extras Generadas *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalle en qué fechas y trámites se acumularon las horas extraordinarias que se solicita compensar..."
                  value={tasksPerformed}
                  onChange={(e) => setTasksPerformed(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* 3. VACACIONES */}
          {currentTemplate?.type === 'vacaciones' && (
            <div className="space-y-3 p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                Período Vacacional y Plan de Relevo de Ventanilla
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Gestión Laboral *</label>
                  <input
                    type="text"
                    value={managementPeriod}
                    onChange={(e) => setManagementPeriod(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Fecha Inicio *</label>
                  <input
                    type="date"
                    required
                    value={vacationStart}
                    onChange={(e) => setVacationStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Fecha Fin *</label>
                  <input
                    type="date"
                    required
                    value={vacationEnd}
                    onChange={(e) => setVacationEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Días Hábiles *</label>
                  <input
                    type="number"
                    value={totalWorkingDays}
                    onChange={(e) => setTotalWorkingDays(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Funcionario Designado para el Relevo de Ventanilla *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Lic. Javier Morales / Sra. Sonia Choque"
                  value={replacementStaffName}
                  onChange={(e) => setReplacementStaffName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Plan de Relevo y Entrega de Expedientes en Trámite *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detalle el estado de los expedientes que quedan asignados al funcionario de relevo..."
                  value={tasksPerformed}
                  onChange={(e) => setTasksPerformed(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* 4. MÉDICA */}
          {currentTemplate?.type === 'medica' && (
            <div className="space-y-3 p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                Datos de la Baja o Consulta Médica
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Entidad de Salud *</label>
                  <input
                    type="text"
                    required
                    value={medicalCenter}
                    onChange={(e) => setMedicalCenter(e.target.value)}
                    placeholder="Ej. Caja Nacional de Salud (CNS)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Nº Formulario / Boleta *</label>
                  <input
                    type="text"
                    required
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="Ej. BM-2026-789"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Días Prescritos *</label>
                  <input
                    type="number"
                    value={medicalLeaveDays}
                    onChange={(e) => setMedicalLeaveDays(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Fecha Inicio Reposo *</label>
                  <input
                    type="date"
                    required
                    value={medicalStart}
                    onChange={(e) => setMedicalStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Fecha Reincorporación *</label>
                  <input
                    type="date"
                    required
                    value={medicalEnd}
                    onChange={(e) => setMedicalEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Observaciones / Indicaciones Médicas
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre indicaciones de reposo o tratamiento..."
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* 5. CUSTOM / PERSONALIZADA */}
          {currentTemplate?.type === 'personalizada' && (
            <div className="space-y-3 p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                Campos del Formato Digital Configurado
              </div>

              {currentTemplate.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {field.label} {field.required && '*'}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={customFields[field.id] || ''}
                      onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  ) : field.type === 'select' && field.options ? (
                    <select
                      value={customFields[field.id] || field.options[0]}
                      onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={customFields[field.id] || ''}
                      onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Institutional Signatures Preview Info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Cadena de Aprobación Oficial AETN:
              </span>
              Esta solicitud se emite con firma del solicitante y será elevada para visado de <strong>Lic. Diego Casillas (Encargado de Reclamos)</strong>, elevación a <strong>Jefe de Departamento</strong> y visto bueno de <strong>Gerente Comercial</strong>.
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-300 dark:border-slate-700"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Guardar Solicitud</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Guardar e Imprimir Formulario</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
