export interface IAppointment {
    _id: string;
    advisorId: {
      _id: string;
      username: string;
      email: string;
      profilePic: string;
    };
    date: string;
    startTime: string;
    fee: number;
    duration: number;
    maxBookings: number;
    status: "Available" | "Booked" | "Cancelled";
    bookedBy?: {
      _id: string;
      username: string;
      email: string;
      profilePic: string;
    };
    location: "Virtual" | "Physical";
    locationDetails: string;
    description: string;
  }