export interface ScaleOption {
  label: string;
  score: number;
}

export interface ScaleItem {
  id: string;
  question: string;
  options: ScaleOption[];
  genderSpecific?: 'female' | 'male';
  domain?: string;
  subDomain?: string;
  optional?: boolean;
}

export interface Scale {
  id: string;
  name: string;
  category: 'funcionales' | 'pediatricos';
  description: string;
  items: ScaleItem[];
  calculateResult: (totalScore: number, context?: { gender?: 'male' | 'female', domainScores?: Record<string, number> }) => string;
}

const PEDI_OPTIONS: ScaleOption[] = [
  { label: 'Incapaz (0)', score: 0 },
  { label: 'Capaz (1)', score: 1 }
];

const WEEFIM_OPTIONS: ScaleOption[] = [
  { label: '7 - Independencia completa', score: 7 },
  { label: '6 - Independencia modificada', score: 6 },
  { label: '5 - Supervisión', score: 5 },
  { label: '4 - Asistencia mínima (75%+)', score: 4 },
  { label: '3 - Asistencia moderada (50%+)', score: 3 },
  { label: '2 - Asistencia máxima (25-49%)', score: 2 },
  { label: '1 - Asistencia Total (0-24%)', score: 1 }
];

const PEDSQL_OPTIONS: ScaleOption[] = [
  { label: 'Nunca (0)', score: 100 },
  { label: 'Casi nunca (1)', score: 75 },
  { label: 'A veces (2)', score: 50 },
  { label: 'A menudo (3)', score: 25 },
  { label: 'Casi siempre (4)', score: 0 }
];

export const SCALES: Scale[] = [
  {
    id: 'barthel',
    name: 'Índice de Barthel',
    category: 'funcionales',
    description: 'Evaluación de las actividades de la vida diaria (AVD).',
    items: [
      {
        id: 'barthel_alimentacion',
        question: 'Alimentación',
        options: [
          { label: 'Incapaz', score: 0 },
          { label: 'Necesita ayuda para cortar carne, el pan, etc.', score: 5 },
          { label: 'Independiente', score: 10 }
        ]
      },
      {
        id: 'barthel_traslado',
        question: 'Traslado (silla a la cama, cama a la silla)',
        options: [
          { label: 'Incapaz, no tiene equilibrio para sentarse', score: 0 },
          { label: 'Gran ayuda (una o dos personas, puede sentarse)', score: 5 },
          { label: 'Pequeña ayuda (física o verbal)', score: 10 },
          { label: 'Independiente', score: 15 }
        ]
      },
      {
        id: 'barthel_aseo',
        question: 'Aseo personal',
        options: [
          { label: 'Dependiente', score: 0 },
          { label: 'Independiente (lavarse la cara, manos, dientes, afeitarse, peinarse)', score: 5 }
        ]
      },
      {
        id: 'barthel_uso_sanitario',
        question: 'Uso del retrete',
        options: [
          { label: 'Dependiente', score: 0 },
          { label: 'Necesita alguna ayuda (para mantener el equilibrio, quitarse/ponerse la ropa)', score: 5 },
          { label: 'Independiente (entrar/salir, limpiarse, vestirse)', score: 10 }
        ]
      },
      {
        id: 'barthel_baño',
        question: 'Baño (ducha)',
        options: [
          { label: 'Dependiente', score: 0 },
          { label: 'Independiente', score: 5 }
        ]
      },
      {
        id: 'barthel_desplazamiento',
        question: 'Desplazamiento',
        options: [
          { label: 'Inmóvil', score: 0 },
          { label: 'En silla de ruedas (independiente en >50m)', score: 5 },
          { label: 'Anda con ayuda de una persona (física o verbal)', score: 10 },
          { label: 'Independiente (al menos 50m, con o sin bastón)', score: 15 }
        ]
      },
      {
        id: 'barthel_escaleras',
        question: 'Subir y bajar escaleras',
        options: [
          { label: 'Incapaz', score: 0 },
          { label: 'Necesita ayuda (física o verbal)', score: 5 },
          { label: 'Independiente', score: 10 }
        ]
      },
      {
        id: 'barthel_vestido',
        question: 'Vestirse y desvestirse',
        options: [
          { label: 'Dependiente', score: 0 },
          { label: 'Necesita ayuda (al menos el 50% de la tarea)', score: 5 },
          { label: 'Independiente (incluye botones, cremalleras, cordones)', score: 10 }
        ]
      },
      {
        id: 'barthel_control_heces',
        question: 'Control de heces',
        options: [
          { label: 'Incontinente (o necesita enemas)', score: 0 },
          { label: 'Accidente ocasional (máximo 1 vez/semana)', score: 5 },
          { label: 'Continente', score: 10 }
        ]
      },
      {
        id: 'barthel_control_orina',
        question: 'Control de orina',
        options: [
          { label: 'Incontinente (o sondado incapaz de cuidarse)', score: 0 },
          { label: 'Accidente ocasional (máximo 1 vez/24h)', score: 5 },
          { label: 'Continente', score: 10 }
        ]
      }
    ],
    calculateResult: (score) => {
      if (score < 20) return 'Dependencia total';
      if (score < 60) return 'Dependencia severa';
      if (score < 90) return 'Dependencia moderada';
      if (score < 100) return 'Dependencia leve';
      return 'Independencia';
    }
  },
  {
    id: 'lawton',
    name: 'Escala de Lawton y Brody',
    category: 'funcionales',
    description: 'Actividades instrumentales de la vida diaria (AIVD).',
    items: [
      {
        id: 'lawton_telefono',
        question: 'Capacidad para usar el teléfono',
        options: [
          { label: 'No es capaz de usar el teléfono', score: 0 },
          { label: 'Contesta pero no marca', score: 1 },
          { label: 'Marca algunos números conocidos', score: 1 },
          { label: 'Usa el teléfono por iniciativa propia', score: 1 }
        ]
      },
      {
        id: 'lawton_compras',
        question: 'Hacer compras',
        options: [
          { label: 'Incapaz de comprar', score: 0 },
          { label: 'Necesita compañía para cualquier compra', score: 0 },
          { label: 'Realiza pequeñas compras', score: 0 },
          { label: 'Realiza todas las compras independientemente', score: 1 }
        ]
      },
      {
        id: 'lawton_comida',
        question: 'Preparación de la comida',
        genderSpecific: 'female',
        options: [
          { label: 'Necesita que le preparen la comida', score: 0 },
          { label: 'Calienta pero no sigue dieta adecuada', score: 0 },
          { label: 'Prepara si se le dan ingredientes', score: 0 },
          { label: 'Organiza, prepara y sirve solo', score: 1 }
        ]
      },
      {
        id: 'lawton_casa',
        question: 'Cuidado de la casa',
        genderSpecific: 'female',
        options: [
          { label: 'No participa', score: 0 },
          { label: 'Necesita ayuda en todas las labores', score: 1 },
          { label: 'Tareas ligeras pero no mantiene limpieza', score: 1 },
          { label: 'Tareas ligeras (platos, camas)', score: 1 },
          { label: 'Mantiene la casa solo o con ayuda ocasional', score: 1 }
        ]
      },
      {
        id: 'lawton_ropa',
        question: 'Lavado de la ropa',
        genderSpecific: 'female',
        options: [
          { label: 'Todo el lavado debe ser realizado por otro', score: 0 },
          { label: 'Lava pequeñas prendas', score: 1 },
          { label: 'Lava toda su ropa solo', score: 1 }
        ]
      },
      {
        id: 'lawton_transporte',
        question: 'Uso de medios de transporte',
        options: [
          { label: 'No viaja', score: 0 },
          { label: 'Taxi o auto con ayuda de otros', score: 0 },
          { label: 'Transporte público acompañado', score: 1 },
          { label: 'Taxi solo pero no otros medios', score: 1 },
          { label: 'Transporte público o conduce solo', score: 1 }
        ]
      },
      {
        id: 'lawton_medicacion',
        question: 'Responsabilidad sobre su medicación',
        options: [
          { label: 'No es capaz de administrarse su medicación', score: 0 },
          { label: 'Se la preparan previamente', score: 0 },
          { label: 'Toma su medicación a la hora y dosis correcta', score: 1 }
        ]
      },
      {
        id: 'lawton_dinero',
        question: 'Manejo de asuntos económicos',
        options: [
          { label: 'Incapaz de manejar dinero', score: 0 },
          { label: 'Realiza compras diarias pero necesita ayuda en bancos', score: 1 },
          { label: 'Se encarga solo', score: 1 }
        ]
      }
    ],
    calculateResult: (score, context) => {
      if (context?.gender === 'male') {
        if (score === 0) return 'Dependencia Total (0 pts)';
        if (score === 1) return 'Dependencia Grave (1 pt)';
        if (score <= 3) return `Dependencia Moderada (${score} pts)`;
        if (score === 4) return 'Dependencia Leve (4 pts)';
        return 'Autónomo (5 pts)';
      } else {
        if (score <= 1) return `Dependencia Total (${score} pts)`;
        if (score <= 3) return `Dependencia Grave (${score} pts)`;
        if (score <= 5) return `Dependencia Moderada (${score} pts)`;
        if (score <= 7) return `Dependencia Leve (${score} pts)`;
        return 'Autónoma (8 pts)';
      }
    }
  },
  {
    id: 'frail',
    name: 'Escala FRAIL',
    category: 'funcionales',
    description: 'Cribado rápido de fragilidad.',
    items: [
      {
        id: 'frail_fatigue',
        question: '¿Está usted cansado?',
        options: [
          { label: 'No', score: 0 },
          { label: 'Sí', score: 1 }
        ]
      },
      {
        id: 'frail_resistance',
        question: '¿Es incapaz de subir un piso de escaleras?',
        options: [
          { label: 'No', score: 0 },
          { label: 'Sí', score: 1 }
        ]
      },
      {
        id: 'frail_aerobic',
        question: '¿Es incapaz de caminar una manzana?',
        options: [
          { label: 'No', score: 0 },
          { label: 'Sí', score: 1 }
        ]
      },
      {
        id: 'frail_illness',
        question: '¿Tiene más de cinco enfermedades?',
        options: [
          { label: 'No', score: 0 },
          { label: 'Sí', score: 1 }
        ]
      },
      {
        id: 'frail_loss_weight',
        question: '¿Ha perdido más del 5% de su peso en los últimos 6 meses?',
        options: [
          { label: 'No', score: 0 },
          { label: 'Sí', score: 1 }
        ]
      }
    ],
    calculateResult: (score) => {
      if (score === 0) return 'Robusto';
      if (score <= 2) return 'Pre-frágil';
      return 'Frágil';
    }
  },
  {
    id: 'sarcf',
    name: 'Cuestionario SARC-F',
    category: 'funcionales',
    description: 'Detección de sarcopenia.',
    items: [
      {
        id: 'sarcf_fuerza',
        question: 'Fuerza: ¿Qué grado de dificultad tiene para llevar o cargar 4.5 kg?',
        options: [
          { label: 'Ninguna', score: 0 },
          { label: 'Alguna', score: 1 },
          { label: 'Mucha o incapaz', score: 2 }
        ]
      },
      {
        id: 'sarcf_asistencia',
        question: 'Asistencia para caminar: ¿Dificultad para cruzar caminando por un cuarto?',
        options: [
          { label: 'Ninguna', score: 0 },
          { label: 'Alguna', score: 1 },
          { label: 'Mucha, usa auxiliares o incapaz', score: 2 }
        ]
      },
      {
        id: 'sarcf_levantarse',
        question: 'Levantarse de una silla: ¿Dificultad para levantarse de silla o cama?',
        options: [
          { label: 'Ninguna', score: 0 },
          { label: 'Alguna', score: 1 },
          { label: 'Mucha o incapaz sin ayuda', score: 2 }
        ]
      },
      {
        id: 'sarcf_escaleras',
        question: 'Subir escaleras: ¿Dificultad para subir 10 escalones?',
        options: [
          { label: 'Ninguna', score: 0 },
          { label: 'Alguna', score: 1 },
          { label: 'Mucha o incapaz', score: 2 }
        ]
      },
      {
        id: 'sarcf_caidas',
        question: 'Caídas: ¿Cuántas veces se ha caído en el último año?',
        options: [
          { label: 'Ninguna', score: 0 },
          { label: '1 a 3 caídas', score: 1 },
          { label: '4 o más caídas', score: 2 }
        ]
      }
    ],
    calculateResult: (score) => {
      return score >= 4 ? 'Sugiere sarcopenia (≥ 4 puntos)' : 'No sugiere sarcopenia';
    }
  },
  {
    id: 'pedi',
    name: 'PEDI (Pediatric Evaluation of Disability Inventory)',
    category: 'pediatricos',
    description: 'Evaluación de capacidad funcional y desempeño en niños (6 meses a 7.5 años).',
    items: [
      // AUTO-CUIDADO
      { id: 'pedi_ac_1', domain: 'Auto-cuidado', subDomain: 'A. Textura de la comida', question: 'Come comidas sólidas, blando', options: PEDI_OPTIONS },
      { id: 'pedi_ac_2', domain: 'Auto-cuidado', subDomain: 'A. Textura de la comida', question: 'Come tierra', options: PEDI_OPTIONS },
      { id: 'pedi_ac_3', domain: 'Auto-cuidado', subDomain: 'A. Textura de la comida', question: 'Eats cut up/chunky/diced food', options: PEDI_OPTIONS },
      { id: 'pedi_ac_4', domain: 'Auto-cuidado', subDomain: 'A. Textura de la comida', question: 'Come todas las texturas de una mesa', options: PEDI_OPTIONS },
      { id: 'pedi_ac_5', domain: 'Auto-cuidado', subDomain: 'A. Textura de la comida', question: 'Come comidas sólidas, blando (repetido en PDF)', options: PEDI_OPTIONS },
      
      { id: 'pedi_ac_6', domain: 'Auto-cuidado', subDomain: 'B. Uso de utensilios', question: 'Con los dedos', options: PEDI_OPTIONS },
      { id: 'pedi_ac_7', domain: 'Auto-cuidado', subDomain: 'B. Uso de utensilios', question: 'Con la cuchara se lo lleva hasta la boca', options: PEDI_OPTIONS },
      { id: 'pedi_ac_8', domain: 'Auto-cuidado', subDomain: 'B. Uso de utensilios', question: 'Uso correcto de la cuchara', options: PEDI_OPTIONS },
      { id: 'pedi_ac_9', domain: 'Auto-cuidado', subDomain: 'B. Uso de utensilios', question: 'Uso correcto del tenedor', options: PEDI_OPTIONS },

      { id: 'pedi_ac_10', domain: 'Auto-cuidado', subDomain: 'C. Uso de recipientes de bebida', question: 'Sostiene una botella', options: PEDI_OPTIONS },
      { id: 'pedi_ac_11', domain: 'Auto-cuidado', subDomain: 'C. Uso de recipientes de bebida', question: 'Levanta copas para tomar, pero la copa se puede caer', options: PEDI_OPTIONS },
      { id: 'pedi_ac_12', domain: 'Auto-cuidado', subDomain: 'C. Uso de recipientes de bebida', question: 'Levanta copas de forma segura con las dos manos', options: PEDI_OPTIONS },
      { id: 'pedi_ac_13', domain: 'Auto-cuidado', subDomain: 'C. Uso de recipientes de bebida', question: 'Levanta una copa de forma segura con una mano', options: PEDI_OPTIONS },
      { id: 'pedi_ac_14', domain: 'Auto-cuidado', subDomain: 'C. Uso de recipientes de bebida', question: 'Toma líquido de una caja o una jarra', options: PEDI_OPTIONS },

      // MOVILIDAD
      { id: 'pedi_mov_1', domain: 'Movilidad', subDomain: 'A. Transferencias en el Sanitario', question: 'Se sienta y es soportado por un equipo o un cuidador', options: PEDI_OPTIONS },
      { id: 'pedi_mov_2', domain: 'Movilidad', subDomain: 'A. Transferencias en el Sanitario', question: 'Se sienta en sanitarios o vasenilla sin soporte', options: PEDI_OPTIONS },
      { id: 'pedi_mov_3', domain: 'Movilidad', subDomain: 'A. Transferencias en el Sanitario', question: 'Entra y sale de un sanitario pequeño o de una vasenilla', options: PEDI_OPTIONS },
      { id: 'pedi_mov_4', domain: 'Movilidad', subDomain: 'A. Transferencias en el Sanitario', question: 'Entra y sale y se para de un sanitario para adultos', options: PEDI_OPTIONS },
      { id: 'pedi_mov_5', domain: 'Movilidad', subDomain: 'A. Transferencias en el Sanitario', question: 'Entra y sale del sanitario sin necesidad de ayuda de los brazos', options: PEDI_OPTIONS },

      // FUNCIÓN SOCIAL
      { id: 'pedi_soc_1', domain: 'Función Social', subDomain: 'A. Comprensión del significado de las palabras', question: 'Orienta los sonidos', options: PEDI_OPTIONS },
      { id: 'pedi_soc_2', domain: 'Función Social', subDomain: 'A. Comprensión del significado de las palabras', question: 'Responde como "no"; reconoce su propio nombre o familiares', options: PEDI_OPTIONS },
      { id: 'pedi_soc_3', domain: 'Función Social', subDomain: 'A. Comprensión del significado de las palabras', question: 'Entiende 10 palabras', options: PEDI_OPTIONS },
      { id: 'pedi_soc_4', domain: 'Función Social', subDomain: 'A. Comprensión del significado de las palabras', question: 'Entiende cuando se le habla de relaciones entre gente/cosas visibles', options: PEDI_OPTIONS },
      { id: 'pedi_soc_5', domain: 'Función Social', subDomain: 'A. Comprensión del significado de las palabras', question: 'Entiende cuando se le habla acerca del tiempo y secuencias de eventos', options: PEDI_OPTIONS },
    ],
    calculateResult: (score, context) => {
      const ds = context?.domainScores || {};
      let result = `Puntaje Total: ${score}\n`;
      if (ds['Auto-cuidado'] !== undefined) result += `- Auto-cuidado: ${ds['Auto-cuidado']}\n`;
      if (ds['Movilidad'] !== undefined) result += `- Movilidad: ${ds['Movilidad']}\n`;
      if (ds['Función Social'] !== undefined) result += `- Función Social: ${ds['Función Social']}\n`;
      return result.trim();
    }
  },
  {
    id: 'weefim',
    name: 'WeeFIM (Functional Independence Measure for Children)',
    category: 'pediatricos',
    description: 'Medida de independencia funcional para niños. Puntuación de 1 a 7.',
    items: [
      // MOTOR - AUTOCUIDADO
      { id: 'weefim_ac_1', domain: 'Motor', subDomain: 'Autocuidado', question: 'Alimentación', options: WEEFIM_OPTIONS },
      { id: 'weefim_ac_2', domain: 'Motor', subDomain: 'Autocuidado', question: 'Asearse (Arreglo personal)', options: WEEFIM_OPTIONS },
      { id: 'weefim_ac_3', domain: 'Motor', subDomain: 'Autocuidado', question: 'Baño', options: WEEFIM_OPTIONS },
      { id: 'weefim_ac_4', domain: 'Motor', subDomain: 'Autocuidado', question: 'Vestido - hemicuerpo superior', options: WEEFIM_OPTIONS },
      { id: 'weefim_ac_5', domain: 'Motor', subDomain: 'Autocuidado', question: 'Vestido - hemicuerpo inferior', options: WEEFIM_OPTIONS },
      { id: 'weefim_ac_6', domain: 'Motor', subDomain: 'Autocuidado', question: 'Uso del sanitario y aseo perineal', options: WEEFIM_OPTIONS },
      // MOTOR - CONTROL DE ESFÍNTERES
      { id: 'weefim_ce_1', domain: 'Motor', subDomain: 'Control de esfínteres', question: 'Control de la vejiga', options: WEEFIM_OPTIONS },
      { id: 'weefim_ce_2', domain: 'Motor', subDomain: 'Control de esfínteres', question: 'Control del intestino', options: WEEFIM_OPTIONS },
      // MOTOR - MOVILIDAD
      { id: 'weefim_mov_1', domain: 'Motor', subDomain: 'Movilidad (Transferencias)', question: 'Traslado de la cama a silla o silla de ruedas', options: WEEFIM_OPTIONS },
      { id: 'weefim_mov_2', domain: 'Motor', subDomain: 'Movilidad (Transferencias)', question: 'Traslado en baño', options: WEEFIM_OPTIONS },
      { id: 'weefim_mov_3', domain: 'Motor', subDomain: 'Movilidad (Transferencias)', question: 'Traslado en bañera o ducha', options: WEEFIM_OPTIONS },
      // MOTOR - AMBULACIÓN
      { id: 'weefim_amb_1', domain: 'Motor', subDomain: 'Ambulación (Locomoción)', question: 'Caminar / desplazarse en silla de ruedas', options: WEEFIM_OPTIONS },
      { id: 'weefim_amb_2', domain: 'Motor', subDomain: 'Ambulación (Locomoción)', question: 'Subir y bajar escaleras', options: WEEFIM_OPTIONS },
      
      // COGNITIVO - COMUNICACIÓN
      { id: 'weefim_com_1', domain: 'Cognitivo', subDomain: 'Comunicación', question: 'Comprensión', options: WEEFIM_OPTIONS },
      { id: 'weefim_com_2', domain: 'Cognitivo', subDomain: 'Comunicación', question: 'Expresión', options: WEEFIM_OPTIONS },
      // COGNITIVO - CONOCIMIENTO SOCIAL
      { id: 'weefim_cs_1', domain: 'Cognitivo', subDomain: 'Conocimiento Social', question: 'Interacción social', options: WEEFIM_OPTIONS },
      { id: 'weefim_cs_2', domain: 'Cognitivo', subDomain: 'Conocimiento Social', question: 'Solución de problemas', options: WEEFIM_OPTIONS },
      { id: 'weefim_cs_3', domain: 'Cognitivo', subDomain: 'Conocimiento Social', question: 'Memoria', options: WEEFIM_OPTIONS },
    ],
    calculateResult: (score, context) => {
      const ds = context?.domainScores || {};
      let result = `Puntaje Total: ${score}/126\n`;
      if (ds['Motor'] !== undefined) result += `- Subtotal Motor: ${ds['Motor']}/91\n`;
      if (ds['Cognitivo'] !== undefined) result += `- Subtotal Cognitivo: ${ds['Cognitivo']}/35\n`;
      return result.trim();
    }
  },
  {
    id: 'pedsql',
    name: 'PedsQL (Pediatric Quality of Life Inventory)',
    category: 'pediatricos',
    description: 'Inventario de Calidad de Vida Pediátrica (2-18 años). Puntuación transformada (0-100).',
    items: [
      // FUNCIONAMIENTO FÍSICO
      { id: 'pedsql_fis_1', domain: 'Funcionamiento Físico', question: 'Caminar más de una cuadra', options: PEDSQL_OPTIONS },
      { id: 'pedsql_fis_2', domain: 'Funcionamiento Físico', question: 'Correr', options: PEDSQL_OPTIONS },
      { id: 'pedsql_fis_3', domain: 'Funcionamiento Físico', question: 'Participar en actividades deportivas o ejercicio', options: PEDSQL_OPTIONS },
      { id: 'pedsql_fis_4', domain: 'Funcionamiento Físico', question: 'Levantar algo pesado', options: PEDSQL_OPTIONS },
      { id: 'pedsql_fis_5', domain: 'Funcionamiento Físico', question: 'Bañarse o ducharse solo/a', options: PEDSQL_OPTIONS },
      { id: 'pedsql_fis_6', domain: 'Funcionamiento Físico', question: 'Hacer tareas o labores en la casa', options: PEDSQL_OPTIONS },
      { id: 'pedsql_fis_7', domain: 'Funcionamiento Físico', question: 'Tener dolores o molestias', options: PEDSQL_OPTIONS },
      { id: 'pedsql_fis_8', domain: 'Funcionamiento Físico', question: 'Tener poca energía (sentirse cansado/a)', options: PEDSQL_OPTIONS },
      
      // FUNCIONAMIENTO EMOCIONAL
      { id: 'pedsql_emo_1', domain: 'Funcionamiento Emocional', question: 'Sentirse con miedo o asustado/a', options: PEDSQL_OPTIONS },
      { id: 'pedsql_emo_2', domain: 'Funcionamiento Emocional', question: 'Sentirse triste o decaído/a', options: PEDSQL_OPTIONS },
      { id: 'pedsql_emo_3', domain: 'Funcionamiento Emocional', question: 'Sentirse enojado/a', options: PEDSQL_OPTIONS },
      { id: 'pedsql_emo_4', domain: 'Funcionamiento Emocional', question: 'Tener problemas para dormir', options: PEDSQL_OPTIONS },
      { id: 'pedsql_emo_5', domain: 'Funcionamiento Emocional', question: 'Preocuparse por lo que le va a pasar', options: PEDSQL_OPTIONS },
      
      // FUNCIONAMIENTO SOCIAL
      { id: 'pedsql_soc_1', domain: 'Funcionamiento Social', question: 'Llevarse bien con otros niños/as', options: PEDSQL_OPTIONS },
      { id: 'pedsql_soc_2', domain: 'Funcionamiento Social', question: 'Otros niños/as no quieren ser sus amigos/as', options: PEDSQL_OPTIONS },
      { id: 'pedsql_soc_3', domain: 'Funcionamiento Social', question: 'Otros niños/as se burlan de él/ella', options: PEDSQL_OPTIONS },
      { id: 'pedsql_soc_4', domain: 'Funcionamiento Social', question: 'No poder hacer cosas que otros niños/as de su edad pueden hacer', options: PEDSQL_OPTIONS },
      { id: 'pedsql_soc_5', domain: 'Funcionamiento Social', question: 'Seguir el ritmo cuando juega con otros niños/as', options: PEDSQL_OPTIONS },
      
      // FUNCIONAMIENTO ESCOLAR
      { id: 'pedsql_esc_1', domain: 'Funcionamiento Escolar', question: 'Prestar atención en clase', options: PEDSQL_OPTIONS },
      { id: 'pedsql_esc_2', domain: 'Funcionamiento Escolar', question: 'Olvidar cosas', options: PEDSQL_OPTIONS },
      { id: 'pedsql_esc_3', domain: 'Funcionamiento Escolar', question: 'Estar al día con las tareas escolares', options: PEDSQL_OPTIONS },
      { id: 'pedsql_esc_4', domain: 'Funcionamiento Escolar', question: 'Faltar a la escuela por no sentirse bien', options: PEDSQL_OPTIONS },
      { id: 'pedsql_esc_5', domain: 'Funcionamiento Escolar', question: 'Faltar a la escuela para ir al médico o al hospital', options: PEDSQL_OPTIONS },
    ],
    calculateResult: (score) => {
      const mean = (score / 23).toFixed(2);
      let interpretation = `Puntaje Medio: ${mean}/100\n`;
      interpretation += `(Nota: Un puntaje más alto indica mejor calidad de vida)`;
      return interpretation;
    }
  },
  {
    id: 'sppb_vivifrail',
    name: 'SPPB & Vivifrail',
    category: 'funcionales',
    description: 'Batería de desempeño físico y prescripción de ejercicio Vivifrail.',
    items: [
      // SPPB - EQUILIBRIO
      { 
        id: 'sppb_bal_1', 
        domain: 'SPPB: Pruebas de Equilibrio', 
        question: 'A. Pies juntos (10 segundos)', 
        options: [
          { label: 'Mantuvo 10s', score: 1 },
          { label: 'Menos de 10s o no intenta', score: 0 }
        ]
      },
      { 
        id: 'sppb_bal_2', 
        domain: 'SPPB: Pruebas de Equilibrio', 
        question: 'B. Posición semi-tándem (10 segundos)', 
        options: [
          { label: 'Mantuvo 10s', score: 1 },
          { label: 'Menos de 10s o no intenta', score: 0 }
        ]
      },
      { 
        id: 'sppb_bal_3', 
        domain: 'SPPB: Pruebas de Equilibrio', 
        question: 'C. Posición tándem (10 segundos)', 
        options: [
          { label: '10 segundos', score: 2 },
          { label: '3 a 9.99 segundos', score: 1 },
          { label: 'Menos de 3s o no intenta', score: 0 }
        ]
      },
      // SPPB - VELOCIDAD DE MARCHA
      { 
        id: 'sppb_marcha', 
        domain: 'SPPB: Velocidad de Marcha (4m)', 
        question: 'Tiempo en recorrer 4 metros (mejor de 2 intentos)', 
        options: [
          { label: '< 4.82 segundos', score: 4 },
          { label: '4.82 - 6.20 segundos', score: 3 },
          { label: '6.21 - 8.70 segundos', score: 2 },
          { label: '> 8.70 segundos', score: 1 },
          { label: 'Incapaz', score: 0 }
        ]
      },
      // SPPB - LEVANTARSE DE LA SILLA
      { 
        id: 'sppb_silla', 
        domain: 'SPPB: Levantarse de la silla', 
        question: 'Tiempo en levantarse 5 veces de la silla', 
        options: [
          { label: '< 11.19 segundos', score: 4 },
          { label: '11.20 - 13.69 segundos', score: 3 },
          { label: '13.70 - 16.69 segundos', score: 2 },
          { label: '16.70 - 59 segundos', score: 1 },
          { label: 'Más de 60s o incapaz', score: 0 }
        ]
      },
      // VIVIFRAIL - RIESGO DE CAÍDAS
      { 
        id: 'vivifrail_caidas', 
        domain: 'Vivifrail: Riesgo de Caídas', 
        question: '¿2 o más caídas en el último año o 1 caída con atención médica?', 
        optional: true,
        options: [
          { label: 'Sí', score: 1 },
          { label: 'No', score: 0 }
        ]
      },
      { 
        id: 'vivifrail_tug', 
        domain: 'Vivifrail: Riesgo de Caídas', 
        question: 'Timed Up and Go (TUG) > 20 segundos', 
        optional: true,
        options: [
          { label: 'Sí', score: 1 },
          { label: 'No', score: 0 }
        ]
      },
      { 
        id: 'vivifrail_marcha6m', 
        domain: 'Vivifrail: Riesgo de Caídas', 
        question: 'Velocidad de Marcha (6m) > 7.5 segundos', 
        optional: true,
        options: [
          { label: 'Sí', score: 1 },
          { label: 'No', score: 0 }
        ]
      },
      { 
        id: 'vivifrail_cognitivo', 
        domain: 'Vivifrail: Riesgo de Caídas', 
        question: '¿Diagnóstico de deterioro cognitivo moderado?', 
        optional: true,
        options: [
          { label: 'Sí', score: 1 },
          { label: 'No', score: 0 }
        ]
      }
    ],
    calculateResult: (score, context) => {
      const ds = context?.domainScores || {};
      const sppbScore = (ds['SPPB: Pruebas de Equilibrio'] || 0) + 
                        (ds['SPPB: Velocidad de Marcha (4m)'] || 0) + 
                        (ds['SPPB: Levantarse de la silla'] || 0);
      
      const hasRiskOfFalls = (ds['Vivifrail: Riesgo de Caídas'] || 0) > 0;
      
      let passport = '';
      let link = '';
      
      if (sppbScore <= 3) {
        passport = 'Pasaporte A (Discapacidad)';
        link = 'https://tinyurl.com/pasaporteA';
      } else if (sppbScore <= 6) {
        passport = hasRiskOfFalls ? 'Pasaporte B-plus (Fragilidad + Riesgo)' : 'Pasaporte B (Fragilidad)';
        link = hasRiskOfFalls ? 'https://tinyurl.com/pasaporteBplus' : 'https://tinyurl.com/pasaporteB';
      } else if (sppbScore <= 9) {
        passport = hasRiskOfFalls ? 'Pasaporte C-plus (Pre-fragilidad + Riesgo)' : 'Pasaporte C (Pre-fragilidad)';
        link = hasRiskOfFalls ? 'https://tinyurl.com/pasaporteCplus' : 'https://tinyurl.com/pasaporteC';
      } else {
        passport = 'Pasaporte D (Robusto)';
        link = 'https://tinyurl.com/pasaporteD';
      }

      let result = `SPPB Total: ${sppbScore}/12 pts\n`;
      result += `VIVIFRAIL: ${passport}\n`;
      result += `En este enlace descargue el programa de ejercicios: ${link}`;
      
      return result;
    }
  }
];
