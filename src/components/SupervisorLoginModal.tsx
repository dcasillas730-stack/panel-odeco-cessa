import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  X, 
  AlertCircle, 
  Check, 
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface SupervisorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
  savedPin: string;
  onUpdatePin: (newPin: string) => void;
}

export const SupervisorLoginModal: React.FC<SupervisorLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  savedPin,
  onUpdatePin,
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);
  const [currentPinVerify, setCurrentPinVerify] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [changeSuccess, setChangeSuccess] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === savedPin.trim()) {
      setErrorMsg('');
      setPinInput('');
      onSuccessLogin();
      onClose();
    } else {
      setErrorMsg('PIN de acceso incorrecto. Solo el Lic. Diego Casillas está autorizado.');
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinVerify.trim() !== savedPin.trim()) {
      setErrorMsg('El PIN actual no coincide.');
      return;
    }
    if (newPinInput.trim().length < 4) {
      setErrorMsg('El nuevo PIN debe tener al menos 4 dígitos.');
      return;
    }
    onUpdatePin(newPinInput.trim());
    setChangeSuccess('PIN actualizado correctamente con éxito.');
    setCurrentPinVerify('');
    setNewPinInput('');
    setErrorMsg('');
    setTimeout(() => {
      setIsChangingPin(false);
      setChangeSuccess('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Acceso Privado de Jefatura ODECO
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Exclusivo para: <strong className="text-slate-800 dark:text-slate-200">Lic. Diego Casillas</strong>
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

        {/* Content */}
        {!isChangingPin ? (
          <form onSubmit={handleLoginSubmit} className="pt-4 space-y-4">
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              El panel de supervisión, administración de personal y partes oficiales está restringido. 
              Por favor ingresa tu clave o PIN de encargado para acceder:
            </p>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                PIN de Acceso de Jefatura:
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Ingresa tu PIN (Predeterminado: 1234)"
                  className="w-full text-sm font-mono tracking-wider rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-10 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="block text-[11px] text-slate-400 mt-1">
                PIN inicial configurado: <strong className="text-blue-600 font-mono">{savedPin}</strong>
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { setIsChangingPin(true); setErrorMsg(''); }}
                className="text-xs text-slate-500 hover:text-blue-600 underline flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Cambiar mi PIN</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ingresar a Mi Panel</span>
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Nota para el personal dependiente:
              </span>
              <p>
                Si eres técnico, analista o personal de ventanilla, debes utilizar tu <strong>Panel de Dependiente</strong> para registrar tus salidas y retornos de escritorio.
              </p>
            </div>

          </form>
        ) : (
          /* Change PIN Form */
          <form onSubmit={handleChangePinSubmit} className="pt-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Personalizar PIN de Jefatura (Diego Casillas)
            </h4>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {changeSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4" />
                <span>{changeSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                PIN Actual:
              </label>
              <input
                type="password"
                required
                value={currentPinVerify}
                onChange={(e) => setCurrentPinVerify(e.target.value)}
                placeholder="Ingresa el PIN actual"
                className="w-full text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nuevo PIN Privado:
              </label>
              <input
                type="password"
                required
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="Ingresa tu nuevo PIN (mín. 4 caracteres)"
                className="w-full text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => { setIsChangingPin(false); setErrorMsg(''); }}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Volver
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Guardar Nuevo PIN
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
