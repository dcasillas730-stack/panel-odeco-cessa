import React from 'react';
import { 
  X, 
  UserCheck, 
  Building2, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  Monitor,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { StaffMember } from '../types/odeco';

interface StationIdentifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffMember[];
  currentStaffId: string;
  onSelectStation: (staffId: string) => void;
  onOpenSupervisorLogin: () => void;
}

export const StationIdentifyModal: React.FC<StationIdentifyModalProps> = ({
  isOpen,
  onClose,
  staffList,
  currentStaffId,
  onSelectStation,
  onOpenSupervisorLogin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/70 dark:bg-blue-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Identifícate en tu Puesto de Trabajo
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona tu nombre y ventanilla asignada para vincular este dispositivo
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

        {/* Stations Grid */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Personal Dependiente Activo en Ventanillas ODECO:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Jornada Continua 08:00 a 16:00
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staffList.map((staff) => {
              const isSelected = staff.id === currentStaffId;
              const isSupervisorCard = staff.id === 'staff-1' || staff.fullName.includes('Diego Casillas');

              return (
                <div
                  key={staff.id}
                  onClick={() => {
                    if (isSupervisorCard) {
                      onOpenSupervisorLogin();
                      onClose();
                    } else {
                      onSelectStation(staff.id);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-start gap-3 relative ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 shadow-xs'
                      : isSupervisorCard
                      ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/10 hover:border-amber-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSupervisorCard
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                  }`}>
                    {staff.avatarInitials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <strong className="block text-slate-900 dark:text-white text-xs truncate">
                        {staff.fullName}
                      </strong>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.2 rounded">
                          Activo
                        </span>
                      )}
                      {isSupervisorCard && (
                        <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> PIN
                        </span>
                      )}
                    </div>

                    <span className="block text-[11px] text-blue-700 dark:text-blue-300 font-semibold truncate mt-0.5">
                      {staff.deskIdentifier}
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {staff.role}
                    </span>
                  </div>

                  <div className="self-center text-slate-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Supervisor PIN Callout */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  ¿Eres el Encargado Lic. Diego Casillas?
                </span>
                <span className="text-[11px] text-slate-500">
                  Ingresa directamente a tu Panel de Jefatura con tu PIN de 4 dígitos.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenSupervisorLogin();
                onClose();
              }}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 text-center"
            >
              Ingresar con PIN →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
