export type SectionType = 'عربي' | 'لغات';

export interface PhaseStructure {
  grades: string[];
  subjects: string[];
}

export const schoolStructure: Record<SectionType, { phases: Record<'حضانة' | 'ابتدائي', PhaseStructure> }> = {
  عربي: {
    phases: {
      حضانة: {
        grades: ['KG1', 'KG2'],
        subjects: ['عربي', 'رياضيات', 'متعدد', 'English Connect', 'English Crystal'],
      },
      ابتدائي: {
        grades: ['أولي', 'تانية', 'تالتة'],
        subjects: ['عربي', 'رياضيات', 'English', 'دين'],
      },
    },
  },
  لغات: {
    phases: {
      حضانة: {
        grades: ['KG1', 'KG2'],
        subjects: ['عربي', 'Math', 'متعدد', 'English Connect +', 'English Crystal'],
      },
      ابتدائي: {
        grades: ['أولي', 'تانية', 'تالتة'],
        subjects: ['عربي', 'Math', 'English', 'دين'],
      },
    },
  },
};
