import { SlotEntity, DateObject, GetData, RoomsProviderData, RoomEntity } from "./providers/Interfaces";
import mergeSlots from "./mergeSlots";
import inverseSlots from "./inverseSlots";

export interface RoomStatus extends RoomEntity {
    metaData: RoomsProviderData,
    name: string,
    bookedSlots: SlotEntity[],
    freeSlots: SlotEntity[],
}

export default function findFreeSlots(from: DateObject, to: DateObject, data: GetData, metaData: RoomsProviderData): RoomStatus[] {
    return data.map(room => {
        const slots = mergeSlots(room.bookedSlots);

        const freeSlots = inverseSlots(from, to, slots);

        return {
            ...room,
            metaData,
            bookedSlots: slots,
            freeSlots,
        }
    })
}