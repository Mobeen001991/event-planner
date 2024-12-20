import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Firestore, collection, query, where } from '@angular/fire/firestore';
import { addDoc, collectionData, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { TableComponent } from 'src/app/components/table/table.component';
import { Transaction } from 'src/app/model/event.data';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, AngularFireStorageModule, TableComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss'
})
export class MyEventsComponent {
  columns= signal([
    { value: 'eventName', label: 'Event' },
    { value: 'tickets', label: 'Tickets' },
    { value: 'totalAmount', label: 'Total Amount' },
    { value: 'transactionDate', label: 'Date' },
    { value: 'status', label: 'Status' }
  ]);
  // Fetch purchased events for the logged-in user
  totalAmount = computed(() => this.purchasedEvents().reduce((sum, event) => sum + event.totalAmount, 0));
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  purchasedEvents = signal<Transaction[]>([]);
  async ngOnInit(): Promise<void> {
    await this.fetchPurchasedEvents();
  }
  private async fetchPurchasedEvents() {
    const userId = this.authService.getCurrentUser()?.uid;

    if (!userId) {
      console.error('User not logged in.');
      return;
    }

    const transactionsCollection = collection(this.firestore, 'transactions');
    const q = query(transactionsCollection, where('userId', '==', userId));

    try {
      const snapshot = await getDocs(q);
      const events = snapshot.docs.map((doc) => ({
        eventId: doc.data()['eventId'],
        eventName: doc.data()['eventName'],
        tickets: doc.data()['tickets'],
        totalAmount: doc.data()['totalAmount'],
        transactionDate: doc.data()['transactionDate']
      }));
      const now = new Date().getTime(); // Current timestamp

      const transactionList: Transaction[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, 'id'>),
        status: new Date(doc.data()['date']).getTime() > now ? 'active':'in-active',
      }));

      this.purchasedEvents.set(transactionList);
      console.log(transactionList)
    } catch (error) {
      console.error('Error fetching purchased events:', error);
    }
  }
}
