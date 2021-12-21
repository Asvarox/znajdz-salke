export interface DateObject {
    year: number,
    month: number,
    day: number,
}

export interface SlotEntity {
    start: Date,
    end: Date,
}

export interface RoomEntity {
    name: string,
    address: string,
    color?: string,
    bookedSlots: SlotEntity[],
}

export type GetData = RoomEntity[]

export interface RoomsProviderData {
    name: string,
    city: string,
    logo: string,
    bookingUrl: string,
}

export interface RoomsProvider extends RoomsProviderData {
    getData(from: DateObject, end: DateObject): Promise<GetData>,
}