import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Users, 
  HelpCircle, 
  CheckCircle2, 
  BellRing, 
  Volume2, 
  VolumeX, 
  X,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { QueueHelpAlert, StaffMember } from '../types/odeco';
import { playQueueAlertSound } from '../utils/audioUtils';

interface QueueAlertBannerProps {
  activeAlert: QueueHelpAlert | null;
  currentStaffId: string;
  staffList: StaffMember[];
  onTriggerAlert: (data: {
    triggeredByStaffId: string;
    severity: 'moderada' | 'alta' | 'critica';
    estimatedWaitingUsers: number;
    message: string;
  }) => void;
  onRespondAlert: (alertId: string, staffId: string) => void;
  onResolveAlert: (alertId: string) => void;
}

export const QueueAlertBanner: React.FC<QueueAlertBannerProps> = ({
  activeAlert,
  currentStaffId,
  staffList,
  onTriggerAlert,
  onRespondAlert,
  onResolveAlert,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [severity, setSeverity] = useState<'moderada' | 'alta' | 'critica'>('alta');
  const [estimatedUsers, setEstimatedUsers] = useState<number>(10);
  const [message, setMessage] = useState<string>('Fila congestionada en Informaciones. Se solicita apoyo de escritorios cercanos.');

  const currentStaff = staffList.find((s) => s.id === currentStaffId);
  const hasResponded = activeAlert?.respondedByStaffIds.includes(currentStaffId);

  // Staff currently responding
  const respondingStaff = activeAlert
    ? staffList.filter((s) => activeAlert.respondedByStaffIds.includes(s.id))
    : [];

  const handleOpenTriggerModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmitTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStaff) return;

    onTriggerAlert({
      triggeredByStaffId: currentStaff.id,
      severity,
      estimatedWaitingUsers: estimatedUsers,
      message: message.trim() || 'Fila congestionada en Informaciones.',
    });

    playQueueAlertSound();
    setIsModalOpen(false);
  };

  return (
    <>
      {/* If there is an active alert, show the prominent emergency coordination bar */}
      {activeAlert && (
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-lg border-2 border-rose-400 mb-6 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            
            {/* Left side: Icon & Alert details */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center shrink-0 animate-bounce">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white text-rose-800 px-2 py-0.5 rounded-full font-mono">
                    AUXILIO EN VENTANILLA · {activeAlert.estimatedWaitingUsers} USUARIOS EN ESPERA
                  </span>
                  <span className="text-rose-100 text-xs font-mono">
                    Activado a las {activeAlert.timestamp}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  ¡Atención Inmediata! Fila de Informaciones Congestionada ({activeAlert.deskIdentifier})
                </h3>
                <p className="text-xs text-rose-100 max-w-2xl leading-tight">
                  Activado por: <strong>{activeAlert.triggeredByStaffName}</strong>. 
                  Normativa AETN: Se solicita a los escritorios cercanos (Encargado de Reclamos, Gestor ODECO o Apoyo) habilitar atención secundaria para que ningún usuario espere.
                </p>
                {respondingStaff.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-100 flex-wrap">
                    <span className="font-semibold text-white">Apoyando actualmente en atención:</span>
                    {respondingStaff.map((s) => (
                      <span key={s.id} className="bg-emerald-950/60 border border-emerald-400/50 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-200">
                        ✓ {s.fullName} ({s.deskIdentifier})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Action buttons */}
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end flex-wrap">
              <button
                onClick={() => playQueueAlertSound()}
                title="Repetir tono de alerta"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 transition-colors"
              >
                <BellRing className="w-4 h-4" />
              </button>

              {currentStaff && (
                <button
                  onClick={() => onRespondAlert(activeAlert.id, currentStaff.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                    hasResponded
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-white text-rose-900 hover:bg-rose-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{hasResponded ? 'Mi Escritorio Está Apoyando' : 'Habilitar Mi Puesto de Apoyo'}</span>
                </button>
              )}

              <button
                onClick={() => onResolveAlert(activeAlert.id)}
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold border border-white/20 transition-colors"
              >
                Normalizar Fila
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Button to open Trigger Modal (Trigger SOS button) */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-3 sm:p-3.5 rounded-2xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-amber-950 dark:text-amber-200 block truncate">
              Auxilio para Descongestión de Usuarios (AETN)
            </span>
            <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-tight mt-0.5">
              Si hay muchos usuarios haciendo fila en informaciones, pulsa el botón de auxilio para que el equipo cercano apoye en sus escritorios.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenTriggerModal}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs font-extrabold shadow-sm transition-all"
        >
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span className="truncate">Botón de Auxilio: Fila Congestionada</span>
        </button>
      </div>

      {/* Trigger Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Activar Alerta de Auxilio en Ventanilla
                  </h3>
                  <p className="text-xs text-slate-500">
                    Notificará de inmediato al Encargado ODECO, Gestor y Apoyos para atender en sus escritorios.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTrigger} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nivel de Afluencia / Congestión:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSeverity('moderada'); setEstimatedUsers(6); }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      severity === 'moderada'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold ring-1 ring-amber-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <span className="block text-xs">Moderada</span>
                    <span className="text-[10px] text-slate-500 block">5 a 8 personas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSeverity('alta'); setEstimatedUsers(12); }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      severity === 'alta'
                        ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold ring-1 ring-rose-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <span className="block text-xs">Alta</span>
                    <span className="text-[10px] text-slate-500 block">8 a 15 personas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSeverity('critica'); setEstimatedUsers(20); }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      severity === 'critica'
                        ? 'border-red-700 bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-200 font-bold ring-2 ring-red-700'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <span className="block text-xs">Crítica</span>
                    <span className="text-[10px] text-slate-500 block">+15 personas</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número estimado de usuarios esperando:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="3"
                    max="50"
                    value={estimatedUsers}
                    onChange={(e) => setEstimatedUsers(Number(e.target.value))}
                    className="w-24 text-sm font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  />
                  <span className="text-xs text-slate-500">usuarios haciendo fila en informaciones / ventanilla</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mensaje para el equipo de apoyo:
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ej. Hay muchos reclamos por facturación, se requiere apoyo en orientación"
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/80 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Al confirmar, sonará una alerta suave en las computadoras del Encargado y de los compañeros disponibles para que abran su ventanilla o escritorio y reciban a los usuarios.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>EMITIR ALERTA DE AUXILIO</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
};
