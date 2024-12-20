import { CommonModule, formatDate } from '@angular/common';
import { Comment } from '@angular/compiler';
import { Component, OnInit, computed, signal } from '@angular/core';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { addDoc, collectionData, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Firestore, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { EventData } from 'src/app/model/event.data';
import { AuthService } from 'src/app/service/auth.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CardComponent, AngularFireStorageModule, ModalComponent, CommonModule, ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  events = signal<EventData[]>([]); // Signal to hold event data
  filteredEvents = computed(() => this.events()); // Optionally filter events dynamically
  isModalOpen = signal(false); // Signal to control modal visibility
  selectedEvent = signal<EventData | null>(null); // Signal for selected event
  ticketsToBook = signal(1); // Number of tickets to book
  constructor(private firestore: Firestore,
    private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.fetchEvents();
  }

  // Fetch events from Firestore
  private async fetchEvents() {
    const eventsCollection = collection(this.firestore, 'events');
    const snapshot = await getDocs(eventsCollection);
    const now = new Date().getTime(); // Current timestamp
    const eventList: EventData[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<EventData, 'id'>), // Type assertion to ensure proper typing
      date:formatDate(doc.data()['date'], 'dd MMM, yyyy HH:mm', 'en-US'),
      booked: doc.data()['booked'] || 0,
      timestamp: new Date(doc.data()['date']).getTime(),
    })).filter((event) => event.timestamp > now); // Filter out expired events;

    this.events.set(eventList); // Update the signal with fetched data
  }

  // Handle booking logic
  bookEvent(event: any): void {
    if (event.capacity - event.booked > 0) {
      console.log(`Booking event: ${event.name}`);
      alert('Event booked successfully!');
    } else {
      alert('No tickets left to book!');
    }
  }

  openBookingModal(event: EventData): void {
    this.selectedEvent.set(event);
    console.log(this.selectedEvent())
    this.isModalOpen.set(true);
    this.ticketsToBook.set(1); // Reset tickets to book to default value
  }

  closeBookingModal(): void {
    this.isModalOpen.set(false);
    this.selectedEvent.set(null);
    this.ticketsToBook.set(1);
  }

  updateTicketCount(e: any): void {
    const count = Number((e.target as HTMLInputElement).value)
    const event = this.selectedEvent();
    if (event && count > 0 && count <= event.capacity - event.booked) {
      this.ticketsToBook.set(count);
    }
  }

  async confirmBooking(): Promise<void> {
    const event = this.selectedEvent();
    
    const tickets = this.ticketsToBook();
    const userId = this.authService.getCurrentUser()?.uid; // Get current user's UID
    event.booked = event.booked || 0
    if (event && tickets > 0 && tickets <= event.capacity - event.booked && userId) {
      try {
        // Save transaction data
        await this.saveTransactionData(userId, event, tickets);

        // Update event's booked count
        await this.updateEventBookingCount(event.id, event.booked + tickets);
        const newBookedCount = event.booked + tickets;
        this.events.update((events) =>
        events.map((e) =>
          e.id === event.id
            ? { ...e, booked: newBookedCount }
            : e
        )
      );
        alert(`Successfully booked ${tickets} tickets for ${event.name}!`);
        this.closeBookingModal();
      } catch (error) {
        console.error('Error during booking:', error);
        alert('Booking failed. Please try again.');
      }
    } else {
      alert('Invalid number of tickets or user not logged in.');
    }
  }
  private async saveTransactionData(
    userId: string,
    event: EventData,
    tickets: number
  ): Promise<void> {
    const transactionCollection = collection(this.firestore, 'transactions');
    const transactionData = {
      userId,
      eventId: event.id,
      eventName: event.name,
      tickets,
      totalAmount: tickets * event.ticketPrice, // Calculate total amount
      transactionDate: new Date().toISOString(),
    };

    await addDoc(transactionCollection, transactionData);
  }

  private async updateEventBookingCount(eventId: string, newBookedCount: number): Promise<void> {
    console.log(newBookedCount)
    const eventDocRef = doc(this.firestore, `events/${eventId}`);
    await updateDoc(eventDocRef, { booked: newBookedCount });
  }
}

