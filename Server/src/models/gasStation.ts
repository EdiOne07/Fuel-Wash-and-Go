export enum Status {
    Empty = "Empty",
    AverageBusy = "AverageBusy",
    VeryBusy = "VeryBusy"
  }
  
  export interface GasStation {
    id: number;
    washing_station_available: boolean;
    name: string;
    gas_price: number;
    location_id: number;
    status: Status;
    rating: number;
  }
  