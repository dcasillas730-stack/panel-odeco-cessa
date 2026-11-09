import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Check, 
  User, 
  Building2, 
  Phone, 
  Clock, 
  Briefcase,
  AlertTriangle,
  Users
} from 'lucide-react';
import { StaffMember } from '../types/odeco';

interface StaffManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffMember[];
  onAddStaff: (newStaff: Omit<StaffMember, 'id' | 'status' | 'currentLeaveId'>) => void;
  onUpdateStaff: (id: string, updatedData: Partial<StaffMember>) => void;
  onDeleteStaff: (id: string) => void;
  initialEditStaffId?: string | null;
}

export const StaffManageModal: React.FC<StaffManageModalProps> = ({
  isOpen,
  onClose,
  staffList,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  initialEditStaffId = null,
}) => {
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>(initialEditStaffId ? 'edit' : 'list');
  const [editingStaffId, setEditingStaffId] = useState<string | null>(initialEditStaffId);

  // Form states
  const [fullName, setFullName] = useState<string>('');
  const [role, setRole] = useState<string>('Atención al Usuario / Ventanilla');
  const [deskIdentifier, setDeskIdentifier] = useState<string>('Ventanilla ODECO');
  const [phoneExtension, setPhoneExtension] = useState<string>('Ext. 100');
  const [mobileContact, setMobileContact] = useState<string>('');
  const [assignedShift, setAssignedShift] = useState<string>('08:00 - 16:00');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const startEdit = (staff: StaffMember) => {
    setEditingStaffId(staff.id);
    setFullName(staff.fullName);
    setRole(staff.role);
    setDeskIdentifier(staff.deskIdentifier);
    setPhoneExtension(staff.phoneExtension);
    setMobileContact(staff.mobileContact || '');
    setAssignedShift(staff.assignedShift);
    setErrorMessage('');
    setMode('edit');
  };

  const startAdd = () => {
    setEditingStaffId(null);
    setFullName('');
    setRole('Atención al Usuario / Ventanilla');
    setDeskIdentifier(`Ventanilla ${staffList.length + 1} - Atención ODECO`);
    setPhoneExtension(`Ext. 10${staffList.length + 1}`);
    setMobileContact('');
    setAssignedShift('08:00 - 16:00');
    setErrorMessage('');
    setMode('add');
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 2)).toUpperCase() || 'OD';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Por favor ingresa el nombre completo del funcionario.');
      return;
    }
    if (!deskIdentifier.trim()) {
      setErrorMessage('Por favor especifica el puesto o ventanilla asignada.');
      return;
    }

    const initials = getInitials(fullName);

    if (mode === 'add') {
      onAddStaff({
        fullName: fullName.trim(),
        role: role.trim(),
        deskIdentifier: deskIdentifier.trim(),
        phoneExtension: phoneExtension.trim() || 'Ext. 100',
        mobileContact: mobileContact.trim() || undefined,
        assignedShift: assignedShift.trim() || '08:00 - 16:00',
        avatarInitials: initials,
        deskPosition: staffList.length + 1,
      });
      setMode('list');
    } else if (mode === 'edit' && editingStaffId) {
      onUpdateStaff(editingStaffId, {
        fullName: fullName.trim(),
        role: role.trim(),
        deskIdentifier: deskIdentifier.trim(),
        phoneExtension: phoneExtension.trim() || 'Ext. 100',
        mobileContact: mobileContact.trim() || undefined,
        assignedShift: assignedShift.trim() || '08:00 - 16:00',
        avatarInitials: initials,
      });
      setMode('list');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Confirmas dar de baja a ${name} del equipo de ODECO? Sus salidas pasadas se mantendrán en el registro.`)) {
      onDeleteStaff(id);
      if (editingStaffId === id) setMode('list');
    }
  };

  const roleSuggestions = [
    'Atención al Usuario / Ventanilla',
    'Informaciones y Orientación Rápida',
    'Gestor de Reclamos ODECO',
    'Apoyo de Gestor de Reclamos',
    'Analista Legal de Reclamos',
    'Inspector Técnico de Campo',
    'Notificador Oficial ODECO',
    'Asistente de Conciliación y Archivo',
  ];

  const deskSuggestions = [
    'Ventanilla 1 - Audiencias y Descargos',
    'Ventanilla 2 - Recepción de Reclamos',
    'Ventanilla 3 - Informaciones y Orientación',
    'Módulo de Apoyo a Gestor',
    'Escritorio ODECO-02 (Técnica)',
    'Escritorio ODECO-03 (Expedientes)',
    'Módulo Central de Jefatura',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Administración de Personal Dependiente ODECO
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Añadir nuevos funcionarios, actualizar nombres por rotación de personal o reasignar puestos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {mode === 'list' ? (
            /* Staff List View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Equipo Actual ({staffList.length} dependientes):
                </span>
                <button
                  onClick={startAdd}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Añadir Nuevo Funcionario</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-800 dark:text-slate-200 shrink-0">
                        {staff.avatarInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {staff.fullName}
                          </h4>
                          <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                            {staff.phoneExtension}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">
                          {staff.role} · <strong className="text-slate-700 dark:text-slate-300">{staff.deskIdentifier}</strong>
                        </span>
                        {staff.mobileContact && (
                          <span className="text-[11px] text-slate-400 block font-mono">
                            Celular: {staff.mobileContact}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => startEdit(staff)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => handleDelete(staff.id, staff.fullName)}
                        title="Dar de baja funcionario"
                        className="p-1.5 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Add or Edit Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {mode === 'add' ? 'Registrar Nuevo Funcionario' : `Editar Datos de: ${fullName || 'Funcionario'}`}
                </span>
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ← Volver a la lista
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo y Título <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Lic. Fernando Rojas Villegas o Dra. Sofía Prado"
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Cargo / Rol en ODECO */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cargo / Rol en la Oficina ODECO <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ej. Atención al Usuario / Ventanilla"
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {roleSuggestions.map((sug) => (
                    <button
                      type="button"
                      key={sug}
                      onClick={() => setRole(sug)}
                      className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Puesto / Ventanilla / Escritorio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ventanilla / Escritorio Asignado <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={deskIdentifier}
                    onChange={(e) => setDeskIdentifier(e.target.value)}
                    placeholder="Ej. Ventanilla 1 - Recepción de Reclamos"
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {deskSuggestions.map((sug) => (
                    <button
                      type="button"
                      key={sug}
                      onClick={() => setDeskIdentifier(sug)}
                      className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info: Extensión telefónica y Celular */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Interno / Extensión Telefónica
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={phoneExtension}
                      onChange={(e) => setPhoneExtension(e.target.value)}
                      placeholder="Ej. Ext. 104"
                      className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Número Celular (Opcional)
                  </label>
                  <input
                    type="text"
                    value={mobileContact}
                    onChange={(e) => setMobileContact(e.target.value)}
                    placeholder="Ej. +591 712-34567"
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Turno de trabajo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Horario de Jornada
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={assignedShift}
                    onChange={(e) => setAssignedShift(e.target.value)}
                    placeholder="08:00 - 16:00"
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{mode === 'add' ? 'Registrar Funcionario' : 'Guardar Cambios'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
