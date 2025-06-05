import { Flight } from '@/modules/flights/types/flights-types';
import { Passenger } from '../../passengers/types/passenger-types';
import { Seat } from '../../seats/types/seat-types';

export interface BookingData {
  outboundFlight: Flight;
  returnFlight?: Flight;
  passengers: Passenger[];
  outboundSeats: Seat[];
  returnSeats: Seat[];
  contactInfo: {
    email: string;
    phone: string;
  };
  totalPrice: number;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
}