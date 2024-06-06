import { Location } from "./location";
import { TrackingStatus } from "./trackingStatus";

export interface Tracking {
  id: string;
  deviceId: string;
  trackingNumber: string;
  trackingStatus: TrackingStatus;
  location: Location;
}

