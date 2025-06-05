export interface AirportOption {
  value: string;
  label: string;
  searchString: string;
}

export interface AirportSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  setErrors?: React.Dispatch<React.SetStateAction<Errors>>;
  label?: string;
}

export interface Errors {
  originAirport: string;
  destinationAirport: string;
  departureDate: string;
  returnDate: string;
  tripType: string;
  passengers: string;
  sameAirport: string;
}