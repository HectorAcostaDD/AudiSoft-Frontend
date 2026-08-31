import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, GraduationCap, Trash2, Edit3, X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-angular';
import { StudentsService } from '../../services/students.service';
import { ToastService } from '../../services/toast.service';
import { Student } from '../../models/models';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  readonly PlusIcon = Plus;
  readonly StudentIcon = GraduationCap;
  readonly TrashIcon = Trash2;
  readonly EditIcon = Edit3;
  readonly CloseIcon = X;
  readonly AlertIcon = AlertTriangle;
  readonly PrevIcon = ChevronLeft;
  readonly NextIcon = ChevronRight;

  students: Student[] = [];
  isLoading = true;

  // Modales
  isModalOpen = false;
  isConfirmModalOpen = false;

  // Form State
  editingId: number | null = null;
  newName = '';
  errorMessage = '';

  studentToDeleteId: number | null = null;

  // Paginación
  pageNumber = 1;
  pageSize = 10;
  hasMoreData = true;

  constructor(
    private studentsService: StudentsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void { this.loadStudents(); }

  loadStudents(): void {
    this.isLoading = true;
    this.studentsService.getStudents(this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.students = res.data;
          this.hasMoreData = res.data.length === this.pageSize;
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show('Error al cargar los estudiantes', 'error');
      }
    });
  }

  changePage(delta: number): void {
    if (this.pageNumber + delta >= 1) {
      this.pageNumber += delta;
      this.loadStudents();
    }
  }

  onPageSizeChange(): void {
    this.pageNumber = 1;
    this.loadStudents();
  }

  openCreateModal(): void {
    this.editingId = null;
    this.newName = '';
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  openEditModal(student: Student, event: Event): void {
    event.stopPropagation();
    this.editingId = student.id;
    this.newName = student.name;
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.newName = '';
    this.editingId = null;
  }

  saveStudent(): void {
    if (!this.newName.trim()) {
      this.errorMessage = 'Ingrese el nombre del estudiante.';
      return;
    }

    if (this.editingId) {
      this.studentsService.updateStudent(this.editingId, { id: this.editingId, name: this.newName }).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show('Estudiante actualizado correctamente', 'success');
            this.loadStudents();
            this.closeModal();
          } else {
            this.errorMessage = res.message || 'Error al actualizar.';
          }
        },
        error: () => this.toastService.show('Error de conexión con el servidor', 'error')
      });
    } else {
      this.studentsService.createStudent({ name: this.newName }).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show('Estudiante creado exitosamente', 'success');
            this.loadStudents();
            this.closeModal();
          } else {
            this.errorMessage = res.message || 'Error al guardar.';
          }
        },
        error: () => this.toastService.show('Error de conexión con el servidor', 'error')
      });
    }
  }

  promptDelete(id: number, event: Event): void {
    event.stopPropagation();
    this.studentToDeleteId = id;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.studentToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.studentToDeleteId === null) return;

    this.studentsService.deleteStudent(this.studentToDeleteId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('Estudiante eliminado correctamente', 'success');
          this.loadStudents();
        } else {
          this.toastService.show(res.message || 'No se pudo eliminar el estudiante', 'error');
        }
        this.closeConfirmModal();
      },
      error: () => {
        this.toastService.show('No se puede eliminar el registro (puede estar asociado a notas).', 'error');
        this.closeConfirmModal();
      }
    });
  }
}