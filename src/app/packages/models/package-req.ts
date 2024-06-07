export interface PackageReq {
  description: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  ownerId: string; // UUID
}
