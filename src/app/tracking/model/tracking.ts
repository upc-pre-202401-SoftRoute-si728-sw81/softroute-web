import { Location } from "./location";
import { TrackingStatus } from "./trackingStatus";

export interface Tracking {
  id: string;
  deviceId: string;
  trackingNumber: string;
  status: TrackingStatus;
  location: Location;
}

