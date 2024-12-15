export interface EventData {
    name: string;
    description: string;
    date: string;
    location: string; // User-friendly address for the form
    locationData: LocationData; // Structured data for DB
    capacity: number;
    ticketPrice: number;
    category: string;
    imageUrl: string;
    id?: string; 
    radius?: number; 
  }
  export interface LocationData {
    lat: number;
    lng: number;
  }
  export interface FileUpload {
    filePath: string;
    downloadURL: string;
  }
  export interface Marker{
    title:string;
    position: LocationData;
    options?:any;
  }