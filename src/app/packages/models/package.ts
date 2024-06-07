import { Customer } from '../../organization/models/customer';

export interface Package {
  id: string;
  description: string;
  details: PackageDetails;
  owner: Customer;
}

export interface PackageDetails {
  weight: number;
  height: number;
  width: number;
  length: number;
}
