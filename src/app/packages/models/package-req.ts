export interface PackageReq {
  description: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  destinationAddress: string;
  customerId: string;
  minTemperature: number;
  maxTemperature: number;
  minHumidity: number;
  maxHumidity: number;
}
