import { RoomsProvider } from "./Interfaces";
import Logo from './images/PlugAndPlay.png';


interface RoomsPayload {
    data: {
        rehearsalRoomsList: Array<{
            name: string,
            address: string,
        }>,
    },
}

interface ReservationsPayload {
    data: {
        calendarReservations: Array<{
            reservationFrom: number,
            reservationTo: number,
            rehearsalRoomName: string,
        }>,
    },
}

const roomsDataRequest = fetch(`https://at-cors-anywhere.fly.dev/raw?url=${encodeURIComponent('http://app.blackfernsoft.pl/pp-client/rehearsalRooms')}`)
    .then(response => response.json());

const colorMaps: { [name: string]: string } = {
    'A': '#ce9917',
    'B': '#954c12',
    '1': '#737373',
    '2': '#5669ab',
}

export const PlugAndPlay: RoomsProvider = {
    name: 'Plug & Play',
    city: 'Wrocław',
    logo: Logo,
    bookingUrl: 'http://sala-prob.pl/rezerwacja',
    getData: async (start, end, signal) => {
        const roomsData: RoomsPayload = await roomsDataRequest;

        const startString = `${String(start.day).padStart(2, '0')}.${String(start.month).padStart(2, '0')}.${start.year}`;
        const endString = `${String(end.day).padStart(2, '0')}.${String(end.month).padStart(2, '0')}.${end.year}`;
        
        const url = `http://app.blackfernsoft.pl/pp-client/reservations?firstDay=${startString}&lastDay=${endString}`
        const response = await fetch(`https://at-cors-anywhere.fly.dev/raw?url=${encodeURIComponent(url)}`, { signal });
        const data: ReservationsPayload = await response.json();

        return roomsData.data.rehearsalRoomsList.map(room => ({
            name: `Sala ${room.name}`,
            address: room.address.replace('\\ UWAGA ! Wszelkie usterki i awarie prosze zglaszac od razu smsem na nr 509378820', '').trim(),
            color: colorMaps[room.name] ?? '#575757',
            bookedSlots: data.data.calendarReservations
                .filter(reservation => reservation.rehearsalRoomName === room.name)
                .map(reservation => ({ start: new Date(reservation.reservationFrom), end: new Date(reservation.reservationFrom) }))
        }));
    }
}

export default PlugAndPlay;
