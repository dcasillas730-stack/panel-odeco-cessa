import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Users, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { AETN_NORMATIVE_ARTICLES } from '../data/initialData';

export const AETNNormativeModal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Marco Legal y Regulatorio
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300">AETN & Derechos Laborales</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Fundamentos Normativos de la Oficina del Consumidor (ODECO)
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              El presente sistema de control operativo no constituye una herramienta de vigilancia arbitraria ni acoso laboral, sino un mecanismo obligatorio para dar cumplimiento a las Resoluciones Regulatorias de la AETN, garantizando la atención permanente al consumidor y respaldando formalmente al funcionario dependiente.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            1. Derechos de los Consumidores
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Los usuarios que acuden a reclamar por sobrecobros, cortes o fluctuaciones tienen derecho legal a ser atendidos sin esperas injustificadas. La ventanilla ODECO no puede quedar desierta durante el horario de atención.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            2. Jornada Continua (08:00 - 16:00)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            La asistencia general se marca en el biométrico institucional. El control interno de ODECO regula exclusivamente la presencia efectiva y los relevos operativos dentro de la jornada para mantener las ventanillas activas.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            3. Protección contra el Acoso Laboral
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            El registro protege al funcionario: si realiza una notificación o inspección en campo, el sistema certifica oficialmente que está en acto de servicio, previniendo cuestionamientos infundados o imputaciones de abandono de puesto.
          </p>
        </div>

      </div>

      {/* Normative Articles Detail */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Artículos Aplicables de la Normativa Regulatoria AETN</span>
        </h3>

        <div className="space-y-3">
          {AETN_NORMATIVE_ARTICLES.map((art) => (
            <div
              key={art.code}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
                  {art.code}
                </span>
                <span className="text-[10px] text-slate-500 font-medium bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  Obligatorio
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {art.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {art.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol of Relevos & Best Practices */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Protocolo Interno de Relevo en Oficinas ODECO</span>
        </h3>
        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
          <li>
            <strong>Antes de retirarse del escritorio:</strong> El funcionario debe ingresar a la aplicación (en su computadora o celular) y seleccionar el motivo y tiempo estimado (menos de 10 segundos).
          </li>
          <li>
            <strong>Relevo de ventanilla:</strong> Si dos ventanillas van a salir al mismo tiempo, el Encargado de Reclamos coordinará un relevo escalonado para no dejar a los reclamantes sin atención.
          </li>
          <li>
            <strong>Diligencias con usuarios:</strong> Vincular siempre el número de reclamo (ej. REC-AETN-8041) para que el tiempo en terreno quede imputado directamente al expediente oficial.
          </li>
          <li>
            <strong>Al retornar a la oficina:</strong> Presionar de inmediato "Confirmar Retorno a Escritorio" para que el semáforo vuelva a verde y la jefatura conozca su disponibilidad.
          </li>
        </ul>
      </div>

    </div>
  );
};
