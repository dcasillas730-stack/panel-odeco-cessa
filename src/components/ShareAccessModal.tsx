import React, { useEffect, useState, useRef } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  QrCode, 
  Smartphone, 
  Monitor, 
  ExternalLink, 
  Share2, 
  Wifi, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import QRCode from 'qrcode';

interface ShareAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffCount: number;
}

export const ShareAccessModal: React.FC<ShareAccessModalProps> = ({
  isOpen,
  onClose,
  staffCount,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [appUrl, setAppUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.origin;
      setAppUrl(currentUrl);

      QRCode.toDataURL(currentUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard && appUrl) {
      navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/70 dark:bg-blue-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Conectar Dispositivos de Dependientes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparte este acceso para que tu equipo ingrese desde sus computadoras y celulares
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto text-xs">
          
          {/* Cloud Sync Status Pill */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                Sincronización en Tiempo Real Activa en la Nube
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              {staffCount} puestos vinculados
            </span>
          </div>

          {/* QR Code and Instructions Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            
            {/* QR Code Card */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Código QR de Acceso ODECO"
                  className="w-44 h-44 rounded-xl border border-slate-300 dark:border-slate-600 p-1.5 bg-white shadow-sm"
                />
              ) : (
                <div className="w-44 h-44 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-400" />
                </div>
              )}
              <span className="mt-2.5 font-bold text-slate-800 dark:text-slate-200 text-[11px] flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>Escanear con Cámara del Celular</span>
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                Android / iPhone (sin instalar aplicaciones)
              </span>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-3">
              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                  <Monitor className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>En Computadoras de Ventanilla:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  1. Copia el enlace oficial y ábrelo en el navegador (Chrome o Edge).<br />
                  2. El dependiente selecciona su nombre y puesto.<br />
                  3. Puedes fijar la pestaña o anclarla en la barra de tareas.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                  <Smartphone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>En Teléfonos Celulares (Campo):</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  1. Abre la cámara del celular y enfoca el código QR.<br />
                  2. Toca el menú de opciones (3 puntos) y pulsa <strong>"Agregar a la pantalla principal"</strong> para usarlo como App móvil.
                </p>
              </div>
            </div>

          </div>

          {/* Copyable Web URL Box */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">
              Enlace Oficial de Acceso a la Plataforma:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-mono text-xs select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Puedes enviar este enlace a los grupos de trabajo de la oficina ODECO por WhatsApp o correo.
            </p>
          </div>

          {/* Security & Roles Notice */}
          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-950 dark:text-amber-200 leading-tight">
              <strong>Control de Privacidad:</strong> Tus dependientes ingresan seleccionando su puesto para reportar diligencias y tramitar solicitudes. El <strong>Panel de Jefatura de Diego Casillas</strong> requiere obligatoriamente tu PIN para ser visualizado o desbloqueado.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
