import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { schoolStructure, SectionType } from '../structure/school-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subject-selection',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './subject-selection.component.html',
  styleUrls: ['./subject-selection.component.css']
})
export class SubjectSelectionComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    this.stopAllSounds();
  }

  stopAllSounds() {
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audioElement => {
      const audio = audioElement as HTMLAudioElement;
      audio.pause();
      audio.currentTime = 0;
    });
    window.speechSynthesis.cancel();
  }

  schoolStructure = schoolStructure;
  
  schoolSections: { label: string; value: SectionType }[] = [
    { label: 'عربي', value: 'عربي' },
    { label: 'لغات', value: 'لغات' }
  ];

  selectedSection: SectionType | null = null;
  
  // تغيير نوع selectedPhase ليكون إما "حضانة" أو "ابتدائي"
  selectedPhase: "حضانة" | "ابتدائي" | null = null;
  
  selectedGrade: string | null = null;
  selectedSubject: string | null = null;

  // استرجاع المراحل
  getPhases(): string[] {
    if (!this.selectedSection) return [];
    // الوصول إلى المفاتيح في كائن phases
    return Object.keys(this.schoolStructure[this.selectedSection].phases);
  }

  // استرجاع الصفوف حسب المرحلة
  getGrades(): string[] {
    if (!this.selectedSection || !this.selectedPhase) return [];
    const structure = this.schoolStructure[this.selectedSection];
    return structure.phases[this.selectedPhase].grades;
  }

  // استرجاع المواد حسب المرحلة
  getSubjects(): string[] {
    if (!this.selectedSection || !this.selectedPhase) return [];
  
    const structure = this.schoolStructure[this.selectedSection];
  
    if (this.selectedGrade === 'KG1') {
      return structure.phases[this.selectedPhase].subjects.filter(subject => subject !== 'English Crystal');
    } else {
      return structure.phases[this.selectedPhase].subjects;
    }
  }
  

  onSectionChange() {
    this.selectedPhase = null;
    this.selectedGrade = null;
    this.selectedSubject = null;
  }

  onPhaseChange() {
    this.selectedGrade = null;
    this.selectedSubject = null;
  }

  startQuestions() {
    if (this.selectedSection && this.selectedPhase && this.selectedGrade && this.selectedSubject) {
      this.router.navigate(['/questions'], {
        queryParams: {
          section: this.selectedSection,
          phase: this.selectedPhase,
          grade: this.selectedGrade,
          subject: this.selectedSubject
        }
      });
    }
  }
}

