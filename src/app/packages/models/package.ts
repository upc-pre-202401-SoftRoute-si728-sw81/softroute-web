import { Client } from '../../organization/models/client';

export interface Package {
  id: string;
  code: string;
  humidity: number;
  temperature: number;
  destinationAddress: string;
  createdAt: string;
  description: string;
  details: PackageDetails;
  status: string;
  owner: Client;
  breakCondition: boolean;
}

export interface PackageDetails {
  weight: number;
  height: number;
  width: number;
  length: number;
}
