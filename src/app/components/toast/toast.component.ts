import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { LucideAngularModule, CheckCircle2, AlertCircle, Info, X } from 'lucide-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts$ | async" class="toast-card glass-panel" [ngClass]="toast.type">
        <lucide-icon [name]="getIcon(toast.type)" size="20" class="toast-icon"></lucide-icon>
        <span class="toast-msg">{{ toast.message }}</span>
        <button class="toast-close" (click)="remove(toast.id)">
          <lucide-icon [name]="CloseIcon" size="16"></lucide-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  readonly SuccessIcon = CheckCircle2;
  readonly ErrorIcon = AlertCircle;
  readonly InfoIcon = Info;
  readonly CloseIcon = X;

  toasts$: Observable<ToastMessage[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  getIcon(type: string) {
    if (type === 'success') return this.SuccessIcon;
    if (type === 'error') return this.ErrorIcon;
    return this.InfoIcon;
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}