export interface Tracking {
  id: string;
  trackingNumber: string;
  status: string;
  statusDate: string;
  latitude: number;
  longitude: number;
  street: string;
  district: string;
  province: string;
  country: string;
  timestamp: string;
  encodedPolyline: string;
}
