import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    // Add animations for modal
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', [animate('300ms ease-in')]),
      transition(':leave', [animate('300ms ease-out')]),
    ]),
  ],
})
export class ModalComponent {
  @Input() isOpen: boolean = false; // Controls modal visibility
  @Input() class: string = ''; // CSS classes for modal
  @Input() width: string = '500px'; // Width of modal
  @Input() height: string = 'auto'; // Height of modal

  @Output() close = new EventEmitter<void>(); // Emit event on close

  closeModal(event: MouseEvent) {
    this.close.emit();
  }
}
