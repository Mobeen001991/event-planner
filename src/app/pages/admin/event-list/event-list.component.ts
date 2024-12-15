import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Firestore, addDoc, collection,collectionData, doc } from '@angular/fire/firestore';
import { CommonModule, formatDate } from '@angular/common';
import { deleteDoc } from 'firebase/firestore';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { EventData, Marker } from 'src/app/model/event.data';
import { MapGoogleComponent } from 'src/app/components/map-google/map-google.component';

declare var google: any;

@Component({
  selector: 'app-create-events',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule,ReactiveFormsModule, AngularFireStorageModule, ModalComponent, MapGoogleComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export  class EventListComponent implements OnInit {
  events = signal<EventData[]>([])
  showEvent = signal<boolean>(false)
  constructor( 
    private firestore: Firestore,
 
  ) {
   
  }
  ngOnInit(): void {
    this.fetchEvents();
  }
  fetchEvents(): void {
    const eventsCollection = collection(this.firestore, 'events');
    collectionData(eventsCollection, { idField: 'id' }).subscribe((data:EventData[]) => {
      data = data.map((e)=>{
        e.date = formatDate(e.date, 'dd MMM, yyyy HH:mm', 'en-US');
        return e
      })
     this.events.set(data); // Assign fetched events to the array
    });
  }
  eventData = signal<EventData>(null)
  markers = signal<Marker[]>([null])
  viewEvent(event: EventData): void {
    this.eventData.set(event)
    this.markers.set([{title:event.name, position:event.locationData}])
    this.showEvent.set(true)
    // Navigate to event details page or open a modal
  }

  deleteEvent(eventId: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      const eventDoc = doc(this.firestore, `events/${eventId}`);
      deleteDoc(eventDoc)
        .then(() => {
          alert('Event deleted successfully.');
          this.fetchEvents(); // Refresh the list after deletion
        })
        .catch((error) => {
          console.error('Error deleting event:', error);
        });
    }
  }

}
