import { Option } from './option.interface';

export interface Question {
  content: {
    text?: string;      // نص السؤال (اختياري)
    image?: string;     // صورة السؤال (اختياري)
    audio?: string;     // ملف صوتي خارجي للسؤال (اختياري)
    speakAnswer?: boolean;
    answer?:string
  };
  language: 'en-US' | 'ar-EG' |'de-DE'; // تحديد اللغة للتحكم في الصوت وغيره
  options: Option[];
  correctAnswer: string;
}
