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
        grades: ['أولى', 'تانية', 'تالتة'],
        subjects: ['عربي', 'رياضيات', 'English Connect', 'الماني','دين إسلامي','دين مسيحي','اكتشف'],
      },
    },
  },
  لغات: {
    phases: {
      حضانة: {
        grades: ['KG1', 'KG2'],
        subjects: ['عربي', 'Math', 'Discover', 'English Connect +', 'English Crystal'],
      },
      ابتدائي: {
        grades: ['Grade 1', 'Grade 2', 'Grade 3'],
        subjects: ['Arabic', 'Math', 'English Connect +','German', 'دين إسلامي','دين مسيحي','Discover'],
      },
    },
  },
};
