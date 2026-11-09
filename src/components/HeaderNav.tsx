import React from 'react';
import { 
  Building2, 
  Clock, 
  Monitor, 
  Smartphone, 
  ShieldCheck, 
  FileText, 
  Users, 
  UserCheck, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  FileSpreadsheet,
  QrCode,
  Share2,
  Headphones
} from 'lucide-react';
import { isWithinODECOShift } from '../utils/timeUtils';

export type NavTabType = 'supervisor' | 'staff' | 'contact_center' | 'requests' | 'report' | 'normative';

interface HeaderNavProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  currentTimeString: string;
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (val: boolean) => void;
  staffName: string;
  isSupervisorAuthenticated: boolean;
  onOpenSupervisorLogin: () => void;
  onLogoutSupervisor: () => void;
  pendingRequestsCount?: number;
  contactCenterUnreadCount?: number;
  onOpenShareModal?: () => void;
  onOpenStationModal?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  currentTimeString,
  isMobileDeviceView,
  setIsMobileDeviceView,
  staffName,
  isSupervisorAuthenticated,
  onOpenSupervisorLogin,
  onLogoutSupervisor,
  pendingRequestsCount = 0,
  contactCenterUnreadCount = 0,
  onOpenShareModal,
  onOpenStationModal,
}) => {
  const isShiftActive = isWithinODECOShift(currentTimeString.slice(0, 5));

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Zone 1: Single text element wordmark with icon */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                ODECO · Control Operativo
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 whitespace-nowrap hidden sm:inline">
                Atención Continua (08:00 - 16:00) · Normativa AETN
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links separated by role */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
            {isSupervisorAuthenticated ? (
              /* Supervisor Navigation (Diego Casillas) */
              <>
                <button
                  onClick={() => setActiveTab('supervisor')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === 'supervisor'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Panel de Jefatura (Diego Casillas)</span>
                </button>

                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors relative ${
                    activeTab === 'requests'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Horas Extras y Formularios</span>
                  {pendingRequestsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('report')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'report'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Parte para Superiores</span>
                </button>

                <button
                  onClick={() => setActiveTab('contact_center')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors relative ${
                    activeTab === 'contact_center'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Contact Center</span>
                  {contactCenterUnreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-400 text-slate-950 font-black text-[10px]">
                      {contactCenterUnreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'staff'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Ver Modo Dependiente</span>
                </button>
              </>
            ) : (
              /* Dependent Staff Navigation */
              <>
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === 'staff'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Mi Escritorio / Ventanilla</span>
                </button>

                <button
                  onClick={() => setActiveTab('contact_center')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors relative ${
                    activeTab === 'contact_center'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Headphones className="w-4 h-4 text-indigo-500" />
                  <span>Contact Center</span>
                </button>

                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === 'requests'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Horas Extras y Solicitudes</span>
                </button>

                {/* Locked Supervisor Button */}
                <button
                  onClick={onOpenSupervisorLogin}
                  title="Acceso exclusivo para el Lic. Diego Casillas con PIN"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Acceso Encargado (Diego Casillas)</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('normative')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'normative'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Normativa AETN</span>
            </button>
          </nav>

          {/* Zone 3: Multi-device connect + Clock + Lock/Unlock Session + Simulator */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Share / Multi-device button */}
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                title="Conectar dispositivos de dependientes mediante código QR o enlace web"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition-all shadow-2xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Conectar Dispositivos (QR)</span>
              </button>
            )}

            {/* Station switcher button when in staff mode */}
            {!isSupervisorAuthenticated && onOpenStationModal && (
              <button
                onClick={onOpenStationModal}
                title="Cambiar el puesto de ventanilla asignado a este dispositivo"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:border-blue-400 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold truncate max-w-[110px]">{staffName.split(' ')[0]} {staffName.split(' ')[1] || ''}</span>
              </button>
            )}

            {/* Clock */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-md border border-slate-200 dark:border-slate-700">
              <Clock className={`w-3.5 h-3.5 ${isShiftActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`} />
              <span className="font-mono tabular-nums text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentTimeString}
              </span>
            </div>

            {/* Lock / Unlock Session Button */}
            {isSupervisorAuthenticated ? (
              <button
                onClick={onLogoutSupervisor}
                title="Cerrar sesión de Jefatura y proteger el panel"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bloquear Jefatura</span>
              </button>
            ) : (
              <button
                onClick={onOpenSupervisorLogin}
                className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Encargado</span>
              </button>
            )}

            {/* Simulator Button */}
            <button
              onClick={() => setIsMobileDeviceView(!isMobileDeviceView)}
              title={isMobileDeviceView ? 'Cambiar a vista de computadora' : 'Simular vista en teléfono celular'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-medium transition-colors"
            >
              {isMobileDeviceView ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">PC</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Celular</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile sub-bar for tab navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 py-1.5 px-2 bg-slate-50 dark:bg-slate-900 text-xs overflow-x-auto gap-1">
        {isSupervisorAuthenticated ? (
          <>
            <button
              onClick={() => setActiveTab('supervisor')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeTab === 'supervisor' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              Jefatura
            </button>
            <button
              onClick={() => setActiveTab('contact_center')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeTab === 'contact_center' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              Contact Center
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeTab === 'requests' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              Formularios {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'report' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              Parte Oficial
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeTab === 'staff' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              Mi Escritorio
            </button>
            <button
              onClick={() => setActiveTab('contact_center')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeTab === 'contact_center' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              Contact Center
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeTab === 'requests' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              Horas Extras
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('normative')}
          className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'normative' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          Normativa
        </button>
      </div>
    </header>
  );
};
