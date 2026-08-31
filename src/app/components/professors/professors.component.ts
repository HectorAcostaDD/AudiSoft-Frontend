import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Users, Trash2, Edit3, X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-angular';
import { ProfessorsService } from '../../services/professors.service';
import { ToastService } from '../../services/toast.service';
import { Teacher } from '../../models/models';

@Component({
  selector: 'app-professors',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.scss']
})
export class ProfessorsComponent implements OnInit {
  readonly PlusIcon = Plus;
  readonly UserIcon = Users;
  readonly TrashIcon = Trash2;
  readonly EditIcon = Edit3;
  readonly CloseIcon = X;
  readonly AlertIcon = AlertTriangle;
  readonly PrevIcon = ChevronLeft;
  readonly NextIcon = ChevronRight;

  professors: Teacher[] = [];
  isLoading = true;
  
  // Modales
  isModalOpen = false;
  isConfirmModalOpen = false;
  
  // Form State
  editingId: number | null = null;
  newName = '';
  errorMessage = '';

  // Elemento a eliminar
  professorToDeleteId: number | null = null;

  // Paginación
  pageNumber = 1;
  pageSize = 10;
  hasMoreData = true;

  constructor(
    private professorsService: ProfessorsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void { this.loadProfessors(); }

  loadProfessors(): void {
    this.isLoading = true;
    this.professorsService.getProfessors(this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.professors = res.data;
          this.hasMoreData = res.data.length === this.pageSize;
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show('Error al cargar los profesores', 'error');
      }
    });
  }

  changePage(delta: number): void {
    if (this.pageNumber + delta >= 1) {
      this.pageNumber += delta;
      this.loadProfessors();
    }
  }

  onPageSizeChange(): void {
    this.pageNumber = 1;
    this.loadProfessors();
  }

  // Abrir modal para Crear
  openCreateModal(): void {
    this.editingId = null;
    this.newName = '';
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  // Abrir modal para Editar al hacer clic en la tarjeta
  openEditModal(prof: Teacher, event: Event): void {
    event.stopPropagation(); // Evitar propagaciones extrañas
    this.editingId = prof.id;
    this.newName = prof.name;
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.newName = '';
    this.editingId = null;
  }

  saveProfessor(): void {
    if (!this.newName.trim()) {
      this.errorMessage = 'Ingrese el nombre del profesor.';
      return;
    }

    if (this.editingId) {
      // Editar
      this.professorsService.updateProfessor(this.editingId, { id: this.editingId, name: this.newName }).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show('Profesor actualizado correctamente', 'success');
            this.loadProfessors();
            this.closeModal();
          } else {
            this.errorMessage = res.message || 'Error al actualizar.';
          }
        },
        error: () => this.toastService.show('Error de conexión con el servidor', 'error')
      });
    } else {
      // Crear
      this.professorsService.createProfessor({ name: this.newName }).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show('Profesor creado exitosamente', 'success');
            this.loadProfessors();
            this.closeModal();
          } else {
            this.errorMessage = res.message || 'Error al guardar.';
          }
        },
        error: () => this.toastService.show('Error de conexión con el servidor', 'error')
      });
    }
  }

  // Modal de Confirmación de Eliminación propio
  promptDelete(id: number, event: Event): void {
    event.stopPropagation();
    this.professorToDeleteId = id;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.professorToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.professorToDeleteId === null) return;

    this.professorsService.deleteProfessor(this.professorToDeleteId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('Profesor eliminado correctamente', 'success');
          this.loadProfessors();
        } else {
          this.toastService.show(res.message || 'No se pudo eliminar el profesor', 'error');
        }
        this.closeConfirmModal();
      },
      error: () => {
        this.toastService.show('No se puede eliminar el registro (puede estar asociado a notas activas).', 'error');
        this.closeConfirmModal();
      }
    });
  }
}