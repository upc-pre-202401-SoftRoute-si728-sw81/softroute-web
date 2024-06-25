import { Employee } from '../../organization/models/employee';
import { Location } from '../../packages/models/location';
import { Point } from './point';

export interface Shipment {
  id: string;
  code: string;
  encodedPolyline: string;
  packagesDelivered: number;
  createdAt: string;
  updatedAt: string;
  carrier: Employee;
  location: Location;
  destinations: Point[];
  numPackages: number;
  status: string;
}
