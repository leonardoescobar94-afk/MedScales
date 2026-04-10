import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  Copy, 
  RotateCcw, 
  ChevronDown, 
  Stethoscope,
  Info,
  CheckCircle2,
  User,
  Users
} from 'lucide-react';
import { SCALES } from './scalesData';

type Gender = 'male' | 'female';

export default function App() {
  const [selectedScaleId, setSelectedScaleId] = useState<string>('all_funcionales');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [gender, setGender] = useState<Gender>('female');
  const [copySuccess, setCopySuccess] = useState(false);

  const activeScales = useMemo(() => {
    if (selectedScaleId === 'all_funcionales') return SCALES.filter(s => s.category === 'funcionales');
    if (selectedScaleId === 'all_pediatricos') return SCALES.filter(s => s.category === 'pediatricos');
    return SCALES.filter(s => s.id === selectedScaleId);
  }, [selectedScaleId]);

  const handleOptionSelect = (itemId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [itemId]: score }));
  };

  const getScaleScore = (scaleId: string) => {
    const scale = SCALES.find(s => s.id === scaleId);
    if (!scale) return 0;
    return scale.items.reduce((sum, item) => {
      if (item.genderSpecific && item.genderSpecific !== gender) return sum;
      return sum + (answers[item.id] || 0);
    }, 0);
  };

  const getDomainScores = (scaleId: string) => {
    const scale = SCALES.find(s => s.id === scaleId);
    if (!scale) return {};
    const scores: Record<string, number> = {};
    scale.items.forEach(item => {
      if (item.domain) {
        scores[item.domain] = (scores[item.domain] || 0) + (answers[item.id] || 0);
      }
    });
    return scores;
  };

  const isScaleComplete = (scaleId: string) => {
    const scale = SCALES.find(s => s.id === scaleId);
    if (!scale) return false;
    return scale.items.every(item => {
      if (item.genderSpecific && item.genderSpecific !== gender) return true;
      if (item.optional) return true;
      return answers[item.id] !== undefined;
    });
  };

  const generateSummary = () => {
    let summary = `--- EVALUACIÓN CLÍNICA ---\n`;
    if (selectedScaleId.includes('funcionales')) {
      summary += `Sexo: ${gender === 'female' ? 'Femenino' : 'Masculino'}\n\n`;
    }

    activeScales.forEach(scale => {
      if (!isScaleComplete(scale.id)) return;
      
      const score = getScaleScore(scale.id);
      const domainScores = getDomainScores(scale.id);
      summary += `[ ${scale.name.toUpperCase()} ]\n`;
      
      let currentDomain = '';
      let currentSubDomain = '';
      
      scale.items.forEach(item => {
        if (item.genderSpecific && item.genderSpecific !== gender) return;
        
        if (item.domain && item.domain !== currentDomain) {
          currentDomain = item.domain;
          summary += `\nDominio: ${currentDomain}\n`;
        }
        if (item.subDomain && item.subDomain !== currentSubDomain) {
          currentSubDomain = item.subDomain;
          summary += `  ${currentSubDomain}\n`;
        }

        const ans = answers[item.id];
        if (item.optional && ans === undefined) return;
        
        const option = item.options.find(o => o.score === ans);
        summary += `  - ${item.question}: ${option?.label || 'N/A'} (${ans ?? 0} pts)\n`;
      });
      
      summary += `\nPUNTUACIÓN TOTAL: ${score}\n`;
      summary += `INTERPRETACIÓN: ${scale.calculateResult(score, { gender, domainScores })}\n\n`;
    });

    return summary.trim();
  };

  const copyToClipboard = async () => {
    const text = generateSummary();
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const resetAll = () => {
    if (window.confirm('¿Desea reiniciar todas las respuestas?')) {
      setAnswers({});
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-32">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-slate-800">MedScales Pro</h1>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Gender Toggle - Only show if functional scales are active */}
            {activeScales.some(s => s.category === 'funcionales') && (
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setGender('female')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    gender === 'female' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <User className="w-3 h-3" />
                  Mujer
                </button>
                <button
                  onClick={() => setGender('male')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    gender === 'male' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <User className="w-3 h-3" />
                  Hombre
                </button>
              </div>
            )}

            {/* Scale Selector */}
            <div className="relative flex-1 sm:flex-none">
              <select 
                value={selectedScaleId}
                onChange={(e) => setSelectedScaleId(e.target.value)}
                className="w-full appearance-none bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <optgroup label="Adultos / Funcionales">
                  <option value="all_funcionales">Funcionales (Todas)</option>
                  {SCALES.filter(s => s.category === 'funcionales').map(scale => (
                    <option key={scale.id} value={scale.id}>{scale.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Pediátricos">
                  <option value="all_pediatricos">Pediátricos (Todas)</option>
                  {SCALES.filter(s => s.category === 'pediatricos').map(scale => (
                    <option key={scale.id} value={scale.id}>{scale.name}</option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6">
        {activeScales.map((scale) => (
          <div key={scale.id} className="mb-12 last:mb-0">
            {/* Scale Header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-slate-900">{scale.name}</h2>
                {isScaleComplete(scale.id) && (
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-black">
                    <CheckCircle2 className="w-3 h-3" />
                    COMPLETA
                  </div>
                )}
              </div>
              <p className="text-slate-500 text-xs flex items-center gap-2 font-medium">
                <Info className="w-3 h-3" />
                {scale.description}
              </p>
              
              {/* Scale Result Preview */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resultado Actual</span>
                <div className="text-right">
                  <div className="text-lg font-black text-blue-600">{getScaleScore(scale.id)} pts</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase whitespace-pre-line">
                    {scale.calculateResult(getScaleScore(scale.id), { gender, domainScores: getDomainScores(scale.id) })}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List Grouped by Domain/Subdomain */}
            <div className="space-y-8">
              {(() => {
                let currentDomain = '';
                let currentSubDomain = '';
                
                return scale.items.map((item, index) => {
                  if (item.genderSpecific && item.genderSpecific !== gender) return null;

                  const domainHeader = item.domain && item.domain !== currentDomain ? (
                    <div key={`domain-${item.domain}`} className="pt-4 first:pt-0">
                      <h3 className="text-lg font-black text-slate-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-tight">
                        {item.domain}
                      </h3>
                    </div>
                  ) : null;
                  if (item.domain) currentDomain = item.domain;

                  const subDomainHeader = item.subDomain && item.subDomain !== currentSubDomain ? (
                    <div key={`subdomain-${item.subDomain}`} className="mb-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                        {item.subDomain}
                      </span>
                    </div>
                  ) : null;
                  if (item.subDomain) currentSubDomain = item.subDomain;

                  return (
                    <div key={item.id} className="space-y-4">
                      {domainHeader}
                      {subDomainHeader}
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
                        <div className="bg-slate-50 px-6 py-2 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Item {index + 1}</span>
                          {answers[item.id] !== undefined && (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                        <div className="p-5">
                          <h4 className="font-bold text-slate-800 mb-4 leading-snug text-sm sm:text-base">{item.question}</h4>
                          <div className="grid gap-2">
                            {item.options.map((option) => (
                              <button
                                key={option.label}
                                onClick={() => handleOptionSelect(item.id, option.score)}
                                className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 flex justify-between items-center group ${
                                  answers[item.id] === option.score
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <span className="text-xs sm:text-sm font-bold">{option.label}</span>
                                <span className={`text-[10px] font-black px-2 py-1 rounded min-w-[24px] text-center ${
                                  answers[item.id] === option.score ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-slate-200'
                                }`}>
                                  {option.score}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        ))}
      </main>

      {/* Global Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resumen General</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-black text-slate-800">
                {SCALES.filter(s => isScaleComplete(s.id)).length} / {SCALES.length} Escalas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAll}
              className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-90"
              title="Reiniciar todo"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all shadow-lg active:scale-95 ${
                SCALES.some(s => isScaleComplete(s.id))
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {copySuccess ? (
                <>
                  <ClipboardCheck className="w-5 h-5" />
                  <span className="hidden sm:inline">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span className="hidden sm:inline">Copiar Resumen</span>
                  <span className="sm:hidden">Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
