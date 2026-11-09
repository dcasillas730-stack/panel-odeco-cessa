import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  FilePlus2, 
  HelpCircle, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { CustomFormTemplate, CustomFormField, StaffRequestType } from '../types/odeco';

interface AddCustomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTemplate: (newTemplate: CustomFormTemplate) => void;
  existingTemplatesCount: number;
}

export const AddCustomFormModal: React.FC<AddCustomFormModalProps> = ({
  isOpen,
  onClose,
  onAddTemplate,
  existingTemplatesCount,
}) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`FOR-ODE-0${existingTemplatesCount + 1}`);
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] = useState<StaffRequestType>('personalizada');
  const [fields, setFields] = useState<CustomFormField[]>([
    {
      id: 'field_1',
      label: 'Motivo o Justificación Detallada',
      type: 'textarea',
      required: true,
      placeholder: 'Indique los motivos y fundamentos que sustentan la solicitud...',
    },
    {
      id: 'field_2',
      label: 'Fecha de Aplicación / Efectividad',
      type: 'date',
      required: true,
    },
  ]);

  if (!isOpen) return null;

  const handleAddField = () => {
    const newFieldId = `field_${Date.now()}`;
    setFields([
      ...fields,
      {
        id: newFieldId,
        label: 'Nuevo Campo Requerido',
        type: 'text',
        required: true,
        placeholder: '',
      },
    ]);
  };

  const handleRemoveField = (id: string) => {
    if (fields.length <= 1) return;
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleFieldChange = (
    id: string,
    key: keyof CustomFormField,
    value: string | boolean | string[]
  ) => {
    setFields(
      fields.map((f) => {
        if (f.id === id) {
          return { ...f, [key]: value };
        }
        return f;
      })
    );
  };

  // Preset templates for quick loading
  const loadPreset = (presetName: string) => {
    if (presetName === 'cambio_turno') {
      setTitle('Solicitud de Relevo / Permuta de Turno de Ventanilla');
      setCode(`FOR-ODE-0${existingTemplatesCount + 1}`);
      setDescription('Solicitud formal para intercambio de turno o cobertura mutua entre funcionarios de ventanilla ODECO.');
      setRequestType('personalizada');
      setFields([
        { id: 'f_turno_fecha', label: 'Fecha de la Permuta', type: 'date', required: true },
        { id: 'f_turno_reemplazo', label: 'Funcionario que Cubrirá la Ventanilla', type: 'text', required: true, placeholder: 'Nombre del dependiente de relevo' },
        { id: 'f_turno_retorno', label: 'Fecha en que se Devolverá el Turno', type: 'date', required: true },
        { id: 'f_turno_motivo', label: 'Motivo Operativo o Personal Justificado', type: 'textarea', required: true },
      ]);
    } else if (presetName === 'duelo_licencia') {
      setTitle('Solicitud de Licencia Especial por Duelo o Matrimonio');
      setCode(`FOR-ODE-0${existingTemplatesCount + 1}`);
      setDescription('Licencia reglamentaria conforme a Ley General del Trabajo con respaldo de documentación.');
      setRequestType('personalizada');
      setFields([
        { id: 'f_lic_tipo', label: 'Tipo de Licencia (Duelo 3 días / Matrimonio 3 días)', type: 'select', required: true, options: ['Duelo Familiar de Primer Grado (3 días hábiles)', 'Matrimonio Civil (3 días hábiles)', 'Nacimiento de Hijo/a (3 días hábiles)'] },
        { id: 'f_lic_inicio', label: 'Fecha de Inicio de la Licencia', type: 'date', required: true },
        { id: 'f_lic_fin', label: 'Fecha de Conclusión', type: 'date', required: true },
        { id: 'f_lic_doc', label: 'Documento de Respaldo Presentado (Certificado)', type: 'text', required: true, placeholder: 'Ej. Certificado de Defunción Nº / Certificado de Matrimonio' },
      ]);
    } else if (presetName === 'comision_aetn') {
      setTitle('Solicitud de Comisión Oficial Externa AETN');
      setCode(`FOR-ODE-0${existingTemplatesCount + 1}`);
      setDescription('Comisión de servicio fuera de oficinas para presentación de descargos o inspecciones conjuntas.');
      setRequestType('horas_extras');
      setFields([
        { id: 'f_com_lugar', label: 'Lugar o Entidad Destino', type: 'text', required: true, placeholder: 'Ej. Oficinas Centrales AETN / Juzgado de Conciliación' },
        { id: 'f_com_fecha', label: 'Fecha de Comisión', type: 'date', required: true },
        { id: 'f_com_salida', label: 'Hora de Salida Estimada', type: 'time', required: true },
        { id: 'f_com_retorno', label: 'Hora de Retorno Estimada', type: 'time', required: true },
        { id: 'f_com_objetivo', label: 'Objetivo y Expedientes AETN Relacionados', type: 'textarea', required: true },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const newTemplate: CustomFormTemplate = {
      id: `tmpl-custom-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || 'Formato digital oficializado para tramitación interna ODECO.',
      type: requestType,
      isCustom: true,
      createdAt: new Date().toISOString().slice(0, 10),
      fields: fields.map((f) => ({
        ...f,
        label: f.label.trim(),
        placeholder: f.placeholder?.trim(),
      })),
    };

    onAddTemplate(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/60 dark:bg-blue-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Añadir Formato Digital
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure un nuevo formulario oficial para llenado digital e impresión con pie de firmas
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Quick Presets Banner */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Cargar Plantillas Preconfiguradas (Opcional):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadPreset('cambio_turno')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
              >
                + Permuta / Cambio de Turno
              </button>
              <button
                type="button"
                onClick={() => loadPreset('duelo_licencia')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
              >
                + Licencia Duelo / Matrimonio
              </button>
              <button
                type="button"
                onClick={() => loadPreset('comision_aetn')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
              >
                + Comisión Oficial AETN
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Título del Formato / Solicitud *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Solicitud de Permiso Especial de Urgencia"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Código del Formulario *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej. FOR-ODE-05"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Categoría Base
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as StaffRequestType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="personalizada">Personalizada / Trámite Interno</option>
                <option value="horas_extras">Horas Extras de Trabajo</option>
                <option value="compensacion">Compensación de Tiempo</option>
                <option value="vacaciones">Vacaciones y Relevos</option>
                <option value="medica">Baja o Consulta Médica</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Descripción / Alcance Operativo
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Finalidad del formulario conforme a normativa laboral..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Form Fields Builder */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Campos Dinámicos a Llenar por el Personal</span>
              </div>
              <button
                type="button"
                onClick={handleAddField}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-semibold text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Campo</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row gap-2.5 items-start sm:items-center"
                >
                  <span className="text-slate-400 font-mono text-[11px] w-5 shrink-0">
                    #{index + 1}
                  </span>

                  {/* Field Label */}
                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      required
                      value={field.label}
                      onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                      placeholder="Nombre de la pregunta / campo"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Field Type */}
                  <div className="w-full sm:w-36 shrink-0">
                    <select
                      value={field.type}
                      onChange={(e) => handleFieldChange(field.id, 'type', e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    >
                      <option value="text">Texto Corto</option>
                      <option value="textarea">Texto Largo / Justificación</option>
                      <option value="date">Fecha</option>
                      <option value="time">Hora</option>
                      <option value="number">Número</option>
                      <option value="select">Opciones de Selección</option>
                    </select>
                  </div>

                  {/* Required Checkbox */}
                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0 text-slate-600 dark:text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-[11px]">Obligatorio</span>
                  </label>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    disabled={fields.length <= 1}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Signatures Reminder */}
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-950 dark:text-blue-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Pie de Firmas Oficial Incorporado Automáticamente:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-tight">
              Al imprimir cualquier solicitud creada con este formato, el documento incluirá obligatoriamente los casilleros de firma para:
              <strong> Funcionario Solicitante</strong>, 
              <strong> Lic. Diego Casillas (Encargado de Reclamos ODECO)</strong>, 
              <strong> Jefe de Departamento</strong> y 
              <strong> Gerente Comercial</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Registrar Formato Digital</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
