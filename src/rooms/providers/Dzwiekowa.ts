import { DateObject, GetData, RoomsProvider } from "./Interfaces";
import Logo from './images/Dzwiekowa.png';

interface ReservationPayload {
    startDate: string,
    endDate: string,
    roomId: number,
}

interface RoomPayload {
    id: string,
    name: string,
    address: string,
    color: string,
}

interface DataPayload {
    rooms: RoomPayload[],
    reservations: ReservationPayload[],
}

export const Dzwiekowa: RoomsProvider = {
    name: 'Dzwiękówa',
    city: 'Wrocław',
    logo: Logo,
    bookingUrl: 'https://dzwiekowa.pl/#rezerwacje',
    getData: async (from: DateObject, to: DateObject, signal): Promise<GetData> => {
        const fromString = `${from.year}-${from.month}-${from.day}`;
        const toString = `${to.year}-${to.month}-${to.day}`;
        const url = `https://dzwiekowa.pl/system-rezerwacji/api/reservations?from=${fromString}&to=${toString}`
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, { signal });
        const data: DataPayload = await response.json();

        const result = data.rooms.map(room => ({
            name: room.name,
            address: room.address,
            color: room.color,
            bookedSlots: data.reservations
                .filter(slot => +slot.roomId === +room.id)
                .map(slot => ({ start: new Date(slot.startDate), end: new Date(slot.endDate) }))
        }));

        return result;
    }
}

export default Dzwiekowa;
