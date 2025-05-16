import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { questionsData } from '../structure/questions-data';
import { Router } from '@angular/router';
import { FractionPipe } from '../pipes/fraction.pipe';
@Component({
  selector: 'app-question',
  imports: [CommonModule,FractionPipe],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],


})
export class QuestionComponent {
  warningStarted: boolean = false;
  timerSecondsPerQuestion = 20;
  balloons: any[] = [];
  timeLeftInSeconds = 0;
  timerInterval: any;
  timeUp = false;
  currentAudio: HTMLAudioElement | null = null;
  questionsData: any = questionsData;
  filteredQuestions: any[] = [];
  section: string = '';
  phase: string='';
  grade: string = '';
  subject: string = '';
  examCompleted = false;
  currentQuestionIndex = 0;
  isCorrectAnswer = false;
  showFeedback = false;
  correctAudio = new Audio('assets/sounds/clip-[AudioTrimmer.com].mp3');
  wrongAudio = new Audio('assets/sounds/wrong.mp3');
  showReward = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.section = params['section'];
      this.phase=params['phase'];
      this.grade = params['grade'];
      this.subject = params['subject'];

      const sectionData = this.questionsData[this.section];
      const phaseData = sectionData?.phases?.[this.phase];
      const gradeData = phaseData?.[this.grade];
      this.filteredQuestions = gradeData?.[this.subject] || [];      
      console.log('Params:',this.phase, this.section, this.grade, this.subject);
      console.log('Filtered Questions:', this.filteredQuestions);
      
      const totalTime = this.filteredQuestions.length * this.timerSecondsPerQuestion;
      this.timeLeftInSeconds = Math.max(totalTime, 10);
      this.startTimer();

      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    });
  }
  

  startTimer() {
    this.warningStarted = false;
    const warningThreshold = this.timeLeftInSeconds * 0.3;
    this.timerInterval = setInterval(() => {
      this.timeLeftInSeconds--;

      if (this.timeLeftInSeconds <= warningThreshold && !this.warningStarted) {
        this.startWarningEffect();
      }

      if (this.timeLeftInSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.timeUp = true;
      }
    }, 1000);
  }

  startWarningEffect() {
    this.warningStarted = true;
  }

  restartExam() {
    clearInterval(this.timerInterval);
    this.currentQuestionIndex = 0;
    this.isCorrectAnswer = false;
    this.showFeedback = false;
    this.showReward = false;
    this.timeUp = false;

    const totalTime = this.filteredQuestions.length * this.timerSecondsPerQuestion;
    this.timeLeftInSeconds = Math.max(totalTime, 10);
    this.startTimer();
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeftInSeconds / 60);
    const seconds = this.timeLeftInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  speakQuestion() {
    this.stopAllSounds();
    const question = this.filteredQuestions[this.currentQuestionIndex];
    const questionNumber = this.currentQuestionIndex + 1;
  
    if (question.language === 'ar-EG') {
      const numberAudioPath = `assets/audio/questionNumber/q-num-${questionNumber}.mp3`;
      const numberAudio = new Audio(numberAudioPath);
      this.currentAudio = numberAudio;
      numberAudio.play();
  
      numberAudio.onended = () => {
        if (question.content?.audio) {
          const questionAudio = new Audio(question.content.audio);
          this.currentAudio = questionAudio;
          questionAudio.play();
        }
      };
    } else if (question.language === 'en-US' || question.language === 'de-DE') {   // 👈 اضفنا de-DE هنا
      const langTextMap: any = {
        'en-US': 'Question',
        'de-DE': 'Frage'
      };
      const questionNumberText = `${langTextMap[question.language]} ${questionNumber}`;
      const utterNumber = new SpeechSynthesisUtterance(questionNumberText);
      utterNumber.lang = question.language;
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((v) => v.lang === question.language);
      if (selectedVoice) utterNumber.voice = selectedVoice;
  
      utterNumber.onend = () => {
        if (question.content?.audio) {
          const questionAudio = new Audio(question.content.audio);
          this.currentAudio = questionAudio;
          questionAudio.play();
        } else if (question.content?.text) {
          const questionText = question.content.text;
          const utterQuestion = new SpeechSynthesisUtterance(questionText);
          utterQuestion.lang = question.language;
          if (selectedVoice) utterQuestion.voice = selectedVoice;
          window.speechSynthesis.speak(utterQuestion);
        }
      };
  
      window.speechSynthesis.speak(utterNumber);
    }
  }
  
  stopAllSounds() {
    window.speechSynthesis.cancel();
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  previousQuestion() {
    if (this.correctAudio || this.wrongAudio) {
      this.correctAudio.pause();
      this.correctAudio.currentTime = 0;
    }

    this.stopAllSounds();

    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.isCorrectAnswer = false;
      this.showFeedback = false;
      this.showReward = false;
      this.speakQuestion();
    }
  }

  checkAnswer(selected: string) {
    this.stopAllSounds();
    this.showFeedback = true;

    const currentQuestion = this.filteredQuestions[this.currentQuestionIndex];

    if (selected === currentQuestion.correctAnswer) {
      this.isCorrectAnswer = true;
      this.showReward = true;

      if (currentQuestion.content.speakAnswer) {
        const answerSpeech = `Good, this is ${currentQuestion.correctAnswer}`;
        const utterAnswer = new SpeechSynthesisUtterance(answerSpeech);
        utterAnswer.lang = 'en-US';
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find((v) => v.lang === 'en-US');
        if (selectedVoice) {
          utterAnswer.voice = selectedVoice;
        }

        utterAnswer.onend = () => {
          this.correctAudio.currentTime = 0;
          this.correctAudio.play();
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterAnswer);
      } else {
        this.correctAudio.currentTime = 0;
        this.correctAudio.play();
      }
    } else {
      this.isCorrectAnswer = false;
      this.wrongAudio.currentTime = 0;
      this.wrongAudio.play();

      this.wrongAudio.onended = () => {
        this.showFeedback = false;
      };
    }
  }

  goBack() {
    if (this.correctAudio || this.wrongAudio) {
      this.correctAudio.pause();
      this.correctAudio.currentTime = 0;
    }
    this.stopAllSounds();
    window.speechSynthesis.cancel();
    this.router.navigate(['/']);
  }

  nextQuestion() {
    window.speechSynthesis.cancel();
    if (this.isCorrectAnswer) {
      this.correctAudio.pause();
      this.correctAudio.currentTime = 0;

      if (this.currentQuestionIndex === this.filteredQuestions.length - 1) {
        this.examCompleted = true;
        this.balloons = Array.from({ length: 20 }, (_, index) => ({
          id: index,
          left: Math.random() * 100,
          duration: Math.random() * 5 + 5,
        }));

        this.completeExam();
        this.timeUp = true;
        return;
      }

      this.currentQuestionIndex++;
      this.isCorrectAnswer = false;
      this.showFeedback = false;
      this.speakQuestion();
      this.showReward = false;
    }
  }

  completeExam() {
    this.examCompleted = true;
    let audio = new Audio('assets/music/congratulations.mp3');
    audio.play();
  }

  playSound() {
    const audio = new Audio('assets/sounds/clip.mp3');
    audio.load();
    audio.play().catch((error) => console.error('🎧 Error playing audio:', error));
  }

  getArabicQuestionNumber(num: number): string {
    const numbers: string[] = [
      'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس',
      'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
      'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر',
      'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر',
      'التاسع عشر', 'العشرون', 'الحادي والعشرون', 'الثاني والعشرون',
      'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون',
      'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون',
      'التاسع والعشرون', 'الثلاثون', 'الحادي والثلاثون', 'الثاني والثلاثون',
      'الثالث والثلاثون', 'الرابع والثلاثون', 'الخامس والثلاثون',
      'السادس والثلاثون', 'السابع والثلاثون', 'الثامن والثلاثون',
      'التاسع والثلاثون', 'الأربعون', 'الحادي والأربعون', 'الثاني والأربعون',
      'الثالث والأربعون', 'الرابع والأربعون', 'الخامس والأربعون',
      'السادس والأربعون', 'السابع والأربعون', 'الثامن والأربعون',
      'التاسع والأربعون', 'الخمسون', 'الحادي والخمسون', 'الثاني والخمسون',
      'الثالث والخمسون', 'الرابع والخمسون', 'الخامس والخمسون',
      'السادس والخمسون', 'السابع والخمسون', 'الثامن والخمسون',
      'التاسع والخمسون', 'الستون', 'الحادي والستون', 'الثاني والستون',
      'الثالث والستون', 'الرابع والستون', 'الخامس والستون',
      'السادس والستون', 'السابع والستون', 'الثامن والستون',
      'التاسع والستون', 'السبعون', 'الحادي والسبعون', 'الثاني والسبعون',
      'الثالث والسبعون', 'الرابع والسبعون', 'الخامس والسبعون',
    ];
    return numbers[num - 1] || num.toString();
  }
  


}


