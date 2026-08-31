import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = ++this.counter;
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, { id, message, type }]);

    setTimeout(() => {
      this.remove(id);
    }, 4000); // Desaparece a los 4 segundos
  }

  remove(id: number) {
    const current = this.toastsSubject.value;
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }
}