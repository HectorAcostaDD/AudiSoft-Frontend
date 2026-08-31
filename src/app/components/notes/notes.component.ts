import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, FileText, Trash2, Edit3, X, AlertTriangle, ChevronLeft, ChevronRight, Search } from 'lucide-angular';
import { NotesService } from '../../services/notes.service';
import { ProfessorsService } from '../../services/professors.service';
import { StudentsService } from '../../services/students.service';
import { ToastService } from '../../services/toast.service';
import { Score, Teacher, Student } from '../../models/models';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  readonly PlusIcon = Plus;
  readonly NoteIcon = FileText;
  readonly TrashIcon = Trash2;
  readonly EditIcon = Edit3;
  readonly CloseIcon = X;
  readonly AlertIcon = AlertTriangle;
  readonly PrevIcon = ChevronLeft;
  readonly NextIcon = ChevronRight;
  readonly SearchIcon = Search;

  notes: Score[] = [];
  teachers: Teacher[] = [];
  students: Student[] = [];

  filteredTeachers: Teacher[] = [];
  filteredStudents: Student[] = [];
  teacherSearchText = '';
  studentSearchText = '';

  isLoading = true;
  isModalOpen = false;
  isConfirmModalOpen = false;
  errorMessage = '';

  // Form State
  editingId: number | null = null;
  newNoteName = '';
  newNoteValue: number | null = null;
  selectedTeacherId: number | null = null;
  selectedStudentId: number | null = null;

  noteToDeleteId: number | null = null;

  // Paginación
  pageNumber = 1;
  pageSize = 10;
  hasMoreData = true;

  constructor(
    private notesService: NotesService,
    private professorsService: ProfessorsService,
    private studentsService: StudentsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadNotes();
    this.loadDropdownData();
  }

  loadNotes(): void {
    this.isLoading = true;
    this.notesService.getNotes(this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.notes = res.data;
          this.hasMoreData = res.data.length === this.pageSize;
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show('Error al cargar las notas', 'error');
      }
    });
  }

  loadDropdownData(): void {
    this.professorsService.getProfessors(1, 100).subscribe({
      next: (res) => { if (res.success) { this.teachers = res.data; this.filteredTeachers = res.data; } }
    });
    this.studentsService.getStudents(1, 100).subscribe({
      next: (res) => { if (res.success) { this.students = res.data; this.filteredStudents = res.data; } }
    });
  }

  filterTeachers(): void {
    const text = this.teacherSearchText.toLowerCase();
    this.filteredTeachers = this.teachers.filter(t => t.name.toLowerCase().includes(text));
  }

  filterStudents(): void {
    const text = this.studentSearchText.toLowerCase();
    this.filteredStudents = this.students.filter(s => s.name.toLowerCase().includes(text));
  }

  changePage(delta: number): void {
    if (this.pageNumber + delta >= 1) {
      this.pageNumber += delta;
      this.loadNotes();
    }
  }

  onPageSizeChange(): void {
    this.pageNumber = 1;
    this.loadNotes();
  }

  openCreateModal(): void {
    this.editingId = null;
    this.newNoteName = '';
    this.newNoteValue = null;
    this.selectedTeacherId = null;
    this.selectedStudentId = null;
    this.errorMessage = '';
    this.teacherSearchText = '';
    this.studentSearchText = '';
    this.filteredTeachers = this.teachers;
    this.filteredStudents = this.students;
    this.isModalOpen = true;
  }

  openEditModal(note: Score, event: Event): void {
    event.stopPropagation();
    this.editingId = note.id;
    this.newNoteName = note.name;
    this.newNoteValue = note.value;
    this.selectedTeacherId = note.teacherId;
    this.selectedStudentId = note.studentId;
    this.errorMessage = '';
    this.teacherSearchText = '';
    this.studentSearchText = '';
    this.filteredTeachers = this.teachers;
    this.filteredStudents = this.students;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveNote(): void {
    if (!this.newNoteName || this.newNoteValue === null || !this.selectedTeacherId || !this.selectedStudentId) {
      this.errorMessage = 'Complete todos los campos.';
      return;
    }

    const payload = {
      id: this.editingId || 0,
      name: this.newNoteName,
      value: Number(this.newNoteValue),
      teacherId: Number(this.selectedTeacherId),
      studentId: Number(this.selectedStudentId)
    };

    if (this.editingId) {
      this.notesService.updateNote(this.editingId, payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show('Nota actualizada correctamente', 'success');
            this.loadNotes();
            this.closeModal();
          } else {
            this.errorMessage = res.message || 'Error al actualizar la nota.';
          }
        },
        error: () => this.toastService.show('Error de conexión con el servidor', 'error')
      });
    } else {
      this.notesService.createNote(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show('Nota creada exitosamente', 'success');
            this.loadNotes();
            this.closeModal();
          } else {
            this.errorMessage = res.message || 'Error al crear la nota.';
          }
        },
        error: () => this.toastService.show('Error de conexión con el servidor', 'error')
      });
    }
  }

  promptDelete(id: number, event: Event): void {
    event.stopPropagation();
    this.noteToDeleteId = id;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.noteToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.noteToDeleteId === null) return;

    this.notesService.deleteNote(this.noteToDeleteId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('Nota eliminada correctamente', 'success');
          this.loadNotes();
        } else {
          this.toastService.show(res.message || 'No se pudo eliminar la nota', 'error');
        }
        this.closeConfirmModal();
      },
      error: () => {
        this.toastService.show('Error al intentar eliminar la nota.', 'error');
        this.closeConfirmModal();
      }
    });
  }
}