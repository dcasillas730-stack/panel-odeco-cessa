import React, { useState } from 'react';
import { 
  Headphones, 
  Clock, 
  Send, 
  Edit3, 
  UserCheck, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Coffee, 
  Calendar, 
  Sparkles,
  Lock,
  X,
  BellRing
} from 'lucide-react';
import { StaffMember, ContactCenterMessage, ContactCenterSchedule } from '../types/odeco';
import { getCurrentTimeString } from '../utils/timeUtils';
import { playQueueAlertSound } from '../utils/audioUtils';

interface ContactCenterModuleProps {
  staffList: StaffMember[];
  currentStaffId: string;
  isSupervisor: boolean;
  messages: ContactCenterMessage[];
  onSendMessage: (message: ContactCenterMessage) => void;
  onUpdateSchedule: (staffId: string, schedule: ContactCenterSchedule) => void;
  onMarkMessagesRead?: () => void;
}

export const ContactCenterModule: React.FC<ContactCenterModuleProps> = ({
  staffList,
  currentStaffId,
  isSupervisor,
  messages,
  onSendMessage,
  onUpdateSchedule,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'schedules'>('chat');
  const [inputText, setInputText] = useState<string>('');
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Edit schedule form state
  const [shiftName, setShiftName] = useState<string>('Turno Mañana');
  const [startTime, setStartTime] = useState<string>('07:30');
  const [endTime, setEndTime] = useState<string>('15:30');
  const [lunchBreakTime, setLunchBreakTime] = useState<string>('12:00 - 12:30 (30 min)');
  const [activeDays, setActiveDays] = useState<string>('Lunes a Viernes');
  const [scheduleNotes, setScheduleNotes] = useState<string>('');

  const currentStaff = staffList.find((s) => s.id === currentStaffId) || staffList[0];
  
  // Contact center staff
  const contactCenterStaff = staffList.filter(
    (s) => s.department === 'contact_center' || s.role.toLowerCase().includes('contact') || s.deskIdentifier.toLowerCase().includes('contact')
  );

  const handleOpenEditSchedule = (staff: StaffMember) => {
    setEditingStaffId(staff.id);
    const curr = staff.contactCenterSchedule;
    if (curr) {
      setShiftName(curr.shiftName);
      setStartTime(curr.startTime);
      setEndTime(curr.endTime);
      setLunchBreakTime(curr.lunchBreakTime);
      setActiveDays(curr.activeDays);
      setScheduleNotes(curr.notes || '');
    } else {
      setShiftName('Turno Regular');
      setStartTime('08:00');
      setEndTime('16:00');
      setLunchBreakTime('12:30 - 13:00 (30 min)');
      setActiveDays('Lunes a Viernes');
      setScheduleNotes('');
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaffId) return;

    const newSchedule: ContactCenterSchedule = {
      shiftName,
      startTime,
      endTime,
      lunchBreakTime,
      activeDays,
      notes: scheduleNotes.trim() || undefined,
      lastUpdated: `${getCurrentTimeString()} por ${isSupervisor ? 'Lic. Diego Casillas' : currentStaff.fullName}`,
    };

    onUpdateSchedule(editingStaffId, newSchedule);
    setEditingStaffId(null);
  };

  const handleSendChatMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: ContactCenterMessage = {
      id: `cc-msg-${Date.now()}`,
      senderId: currentStaff.id,
      senderName: currentStaff.fullName,
      senderRole: isSupervisor ? 'supervisor' : 'contact_center',
      message: text,
      timestamp: getCurrentTimeString(),
      read: false,
    };

    onSendMessage(newMsg);
    setInputText('');
    playQueueAlertSound();
  };

  const quickInstructionsSupervisor = [
    '📞 Priorizar llamadas de reclamo por corte eléctrico en Distrito 4',
    '⚠️ Atender usuario urgente en espera telefónica',
    '🥪 Relevo de almuerzo / refrigerio (30 min)',
    '📋 Registrar número de reclamo AETN en el sistema',
    '✅ Recibido y enterado, buen trabajo',
  ];

  const quickRepliesOperator = [
    '👍 Entendido Lic. Casillas, ya estamos canalizando el reclamo.',
    '📞 Atención telefónica fluida en cabinas, sin llamadas en espera.',
    '🥪 Procedo con mi salida a refrigerio de 30 minutos.',
    '📋 Se registró el reclamo del usuario con citación para mañana.',
  ];

  return (
    <div className="space-y-5">
      
      {/* Institutional Header Banner for Contact Center */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-indigo-800/80 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/70 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-xs">
              <Headphones className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
                  ODECO · Oficina de Contact Center y Atención Telefónica
                </span>
                <span className="text-indigo-400 hidden sm:inline">·</span>
                <span className="text-[11px] text-indigo-300 font-medium">Línea 800 y Canales AETN</span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight mt-0.5 whitespace-normal break-words">
                Gestión de Turnos y Comunicación en Línea con Contact Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/70 border border-emerald-500/50 rounded-full text-emerald-300 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Canal en Vivo Activo</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs between Chat and Schedules */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <p className="text-xs text-indigo-200/90 max-w-xl">
            Módulo exclusivo para operadoras de Contact Center y Jefatura (Lic. Diego Casillas). Permite definir horarios por miembro y chatear en línea en tiempo real.
          </p>

          <div className="flex items-center gap-1.5 bg-indigo-950/80 p-1 rounded-xl border border-indigo-800/80 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat en Línea ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('schedules')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'schedules'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Horarios de Operadoras ({contactCenterStaff.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: CHAT EN LÍNEA DIRECTO */}
      {activeSubTab === 'chat' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col min-h-[500px]">
          
          {/* Chat Header */}
          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center font-bold text-xs">
                💬
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Canal Directo: Jefatura (Diego Casillas) ↔ Operadoras de Contact Center
                </h3>
                <span className="text-[11px] text-slate-500">
                  Escribe en línea para dar instrucciones o responder sobre llamadas y reclamos.
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Tú estás como: <strong className="text-indigo-600 dark:text-indigo-400">{currentStaff.fullName}</strong>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px] bg-slate-50/50 dark:bg-slate-900/50">
            {messages.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No hay mensajes en este canal. Escribe un mensaje abajo para coordinar en tiempo real.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isFromSupervisor = msg.senderRole === 'supervisor';
                const isMe = msg.senderId === currentStaff.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {msg.senderName}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        isFromSupervisor
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {isFromSupervisor ? 'Jefatura ODECO' : 'Contact Center'}
                      </span>
                      <span>· {msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-xl p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-xs'
                          : isFromSupervisor
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 border border-blue-200 dark:border-blue-800 rounded-tl-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Pre-made Actions */}
          <div className="p-2.5 bg-slate-100/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Respuestas rápidas en 1 clic:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(isSupervisor ? quickInstructionsSupervisor : quickRepliesOperator).map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => handleSendChatMessage(quick)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium transition-colors text-left"
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendChatMessage();
                }
              }}
              placeholder={
                isSupervisor
                  ? 'Escribir instrucción en línea a las operadoras de Contact Center...'
                  : 'Escribir respuesta en línea al Lic. Diego Casillas...'
              }
              className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleSendChatMessage()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>

        </div>
      )}

      {/* SUBTAB 2: HORARIOS EDITABLES DE CONTACT CENTER */}
      {activeSubTab === 'schedules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Personal y Horarios de la Oficina de Contact Center
              </h3>
              <p className="text-xs text-slate-500">
                Cada operadora tiene su horario y turno editable en la nube (hora de entrada, salida y almuerzo de 30 min).
              </p>
            </div>
          </div>

          {/* Cards for each Contact Center operator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactCenterStaff.map((staff) => {
              const sched = staff.contactCenterSchedule || {
                shiftName: 'Turno Regular Contact Center',
                startTime: '08:00',
                endTime: '16:00',
                lunchBreakTime: '12:30 - 13:00 (30 min)',
                activeDays: 'Lunes a Viernes',
                notes: 'Atención telefónica de reclamos',
              };

              return (
                <div
                  key={staff.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3.5 relative overflow-hidden"
                >
                  {/* Top status & initials */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                        {staff.avatarInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                            {staff.deskIdentifier}
                          </span>
                          <span className="text-[10px] text-slate-400">{staff.phoneExtension}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                          {staff.fullName}
                        </h4>
                        <span className="text-xs text-slate-500 block">{staff.role}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEditSchedule(staff)}
                      className="px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar Horario</span>
                    </button>
                  </div>

                  {/* Schedule Details Table */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Turno Asignado:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">{sched.shiftName}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Horario de Atención:</span>
                      <strong className="text-indigo-700 dark:text-indigo-300 font-mono font-bold">
                        {sched.startTime} ➔ {sched.endTime}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Almuerzo / Refrigerio:</span>
                      <strong className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                        {sched.lunchBreakTime}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Días Laborables:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{sched.activeDays}</span>
                    </div>

                    {sched.notes && (
                      <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 italic">
                        Nota: {sched.notes}
                      </div>
                    )}
                  </div>

                  {/* Real-time presence indicator */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className={`w-2 h-2 rounded-full ${staff.status === 'at_desk' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      <span>Estado: {staff.status === 'at_desk' ? 'En Cabina Activa' : 'Fuera / Refrigerio'}</span>
                    </span>

                    {sched.lastUpdated && (
                      <span className="text-slate-400 text-[10px]">Actualizado: {sched.lastUpdated}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {editingStaffId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Editar Horario de Turno - Contact Center
                  </h3>
                  <p className="text-xs text-slate-500">
                    {staffList.find((s) => s.id === editingStaffId)?.fullName} · {staffList.find((s) => s.id === editingStaffId)?.deskIdentifier}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingStaffId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
              
              {/* Shift Name */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Turno
                </label>
                <input
                  type="text"
                  required
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                  placeholder="Ej. Turno Mañana, Turno Tarde, Turno Rotativo"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Start and End Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hora de Entrada
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hora de Salida
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Lunch Break (30 min normados) */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Horario de Almuerzo / Refrigerio (30 minutos reglamentarios)
                </label>
                <input
                  type="text"
                  required
                  value={lunchBreakTime}
                  onChange={(e) => setLunchBreakTime(e.target.value)}
                  placeholder="Ej. 12:00 - 12:30 (30 min) o 13:30 - 14:00 (30 min)"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                />
                <div className="flex gap-1.5 mt-1">
                  {['12:00 - 12:30 (30 min)', '12:30 - 13:00 (30 min)', '13:00 - 13:30 (30 min)', '13:30 - 14:00 (30 min)'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setLunchBreakTime(p)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                    >
                      {p.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Days */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Días Laborables
                </label>
                <input
                  type="text"
                  required
                  value={activeDays}
                  onChange={(e) => setActiveDays(e.target.value)}
                  placeholder="Ej. Lunes a Viernes (08:00 - 16:00)"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observaciones de Cabina / Atención
                </label>
                <input
                  type="text"
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  placeholder="Ej. Cabina prioritaria para recepción de cortes no programados"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStaffId(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition-all"
                >
                  Guardar Horario en la Nube
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
