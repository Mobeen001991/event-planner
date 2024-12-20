import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { EventData, LocationData } from 'src/app/model/event.data';
declare var google: any;

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule, AngularFireStorageModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  categories: string[] = ['Music', 'Sports', 'Education', 'Technology'];
  imageUrl = signal<string>('');
  locationForDB = signal<LocationData>(null); // For DB
  @ViewChild('autocompleteInput') autocompleteInput!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private firestore: Firestore,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]],
      ticketPrice: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [null],
      radius: [1, [Validators.required, Validators.min(1)]],
      booked: [0]
    });
  }
  ngOnInit(){}
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `events/${file.name}`;
      const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.eventForm.patchValue({image: reader.result})
    };
      // const fileRef = this.storage.ref(filePath);
      // this.storage.upload(filePath, file).then(() => {
      //   fileRef.getDownloadURL().subscribe((url) => {
      //     this.imageUrl.set(url);
      //   });
      // });
    }
  }

  async onSubmit() {
    if (this.eventForm.valid) {
      const eventData = { ...this.eventForm.value, imageUrl: this.imageUrl(), locationData:this.locationForDB() };
      const eventCollection = collection(this.firestore, 'events');
      await addDoc(eventCollection, eventData);
      alert('Event Created Successfully');
      this.router.navigate(['/admin/events']);
    }
  }
  location: string = '';
  ngAfterViewInit(): void {
    const autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.nativeElement,
      {
        types: ['geocode'], // Specify the type of results (optional)
        componentRestrictions: { country: 'us' }, // Restrict to a specific country (optional)
      }
    );

    // Listen for place changes
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        const formatted_address = place.formatted_address || '';
        const lat = place.geometry?.location.lat() || 0;
        const long = place.geometry?.location.lng() || 0;

        this.ngZone.run(() => { 
          this.locationForDB.set({lat: lat, lng:long});
          this.eventForm.get('location')?.setValue(formatted_address);
        });
      
      }
    });
  }
}
