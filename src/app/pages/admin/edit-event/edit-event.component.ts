import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AngularFireStorageModule],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export default class EditEventComponent implements OnInit {
  // Reactive Form
  eventForm: FormGroup;

  // Signals
  eventId = signal<string | null>(null); // Event ID read from the URL
  isLoading = signal<boolean>(true); // Loading state
  errorMessage = signal<string | null>(null); // Error message
  categories= signal<string[]>(['Music', 'Sports', 'Education', 'Technology']); // Static categories

  private firestore = inject(Firestore);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // Initialize the form
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]],
      ticketPrice: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      radius: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Read event ID from URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventId.set(id);
      this.fetchEvent(id);
    } else {
      this.errorMessage.set('Invalid event ID');
    }
  }

  async fetchEvent(id: string) {
    try {
      // Fetch event data from Firestore
      const eventDoc = doc(this.firestore, `events/${id}`);
      const eventSnapshot = await getDoc(eventDoc);

      if (eventSnapshot.exists()) {
        const eventData = eventSnapshot.data();
        this.eventForm.patchValue(eventData); // Populate form with event data
      } else {
        this.errorMessage.set('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      this.errorMessage.set('Failed to fetch event data');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit() {
    if (this.eventForm.valid && this.eventId()) {
      try {
        // Update the event in Firestore
        const eventDoc = doc(this.firestore, `events/${this.eventId()}`);
        await updateDoc(eventDoc, this.eventForm.value);
        alert('Event updated successfully');
        this.router.navigate(['/admin/events']);
      } catch (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event. Please try again.');
      }
    }
  }
}
