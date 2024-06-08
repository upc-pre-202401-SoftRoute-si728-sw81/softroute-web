export interface Customer {
  id: string; // Este es el UUID o ID del cliente
  names: string;
  surnames: string;
  dni: string;
  email: string | null;
  phoneNumber: string;
}
