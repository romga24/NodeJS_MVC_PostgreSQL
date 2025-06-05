export interface Passenger {
  id: string;
  type: "adult" | "child" | "infant";
  firstName: string;
  lastName: string;
  documentType: "dni" | "passport" | "other";
  documentNumber: string;
  dateOfBirth?: string;
  seatOutbound?: string;
  seatReturn?: string;
  email?: string;
  phone?: string;
}