import { DateObject, GetData, RoomsProvider } from "./Interfaces";
import Logo from './images/Jama.png';

interface ReservationPayload {
    start_at: string,
    end_at: string,
}

export const Jama: RoomsProvider = {
    name: 'JAMA Studio',
    city: 'Wrocław',
    logo: Logo,
    bookingUrl: 'https://www.jama.studio/rezerwacja',
    getData: async (start: DateObject, end: DateObject): Promise<GetData> => {
        const startString = `${start.year}-${String(start.month).padStart(2, '0')}-${String(start.day).padStart(2, '0')}`;
        const endString = `${end.year}-${String(end.month).padStart(2, '0')}-${String(end.day).padStart(2, '0')}`;
        const url = `https://api.jama.studio/api/bookings?start_at=${startString}&end_at=${endString}`
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
        const data: ReservationPayload[] = await response.json();

        return [{
            name: 'JAMA Studio',
            address: 'ul. Dembowskiego 6/8',
            color: '#151935',
            bookedSlots: data.map(slot => ({ start: new Date(slot.start_at), end: new Date(slot.end_at) }))
        }];
    }
}

export default Jama;