import { SlotEntity, DateObject } from "./providers/Interfaces";
import mergeSlots from "./mergeSlots";

describe('findFreeSlots', () => {
    const generateSlot = (from: DateObject, hourFrom: number, minuteFrom: number, to: DateObject, hourTo: number, minuteTo: number): SlotEntity => ({
        start: new Date(from.year, from.month - 1, from.day, hourFrom, minuteFrom),
        end: new Date(to.year, to.month - 1, to.day, hourTo, minuteTo),
    });

    const from = { year: 2021, month: 12, day: 13 };
    
    it('should not merge slots not close to each other', () => {
        const bookedSlots: SlotEntity[] = [
            generateSlot(from, 4, 0, from, 5, 0),
            generateSlot(from, 6, 0, from, 7, 0),
        ];

        const result = mergeSlots(bookedSlots);

        expect(result).toEqual([
            generateSlot(from, 4, 0, from, 5, 0),
            generateSlot(from, 6, 0, from, 7, 0),
        ]);
    });
    
    it('should merge slots one contained in another', () => {
        const bookedSlots: SlotEntity[] = [
            generateSlot(from, 4, 0, from, 7, 0),
            generateSlot(from, 5, 0, from, 6, 0),
        ];

        const result = mergeSlots(bookedSlots);

        expect(result).toEqual([
            generateSlot(from, 4, 0, from, 7, 0),
        ]);
    });
    
    it('should merge slots touching eachother', () => {
        const bookedSlots: SlotEntity[] = [
            generateSlot(from, 4, 0, from, 7, 0),
            generateSlot(from, 7, 0, from, 8, 0),
        ];

        const result = mergeSlots(bookedSlots);

        expect(result).toEqual([
            generateSlot(from, 4, 0, from, 8, 0),
        ]);
    });
    
    it('should merge overlapping slots', () => {
        const bookedSlots: SlotEntity[] = [
            generateSlot(from, 4, 0, from, 7, 0),
            generateSlot(from, 6, 0, from, 8, 0),
        ];

        const result = mergeSlots(bookedSlots);

        expect(result).toEqual([
            generateSlot(from, 4, 0, from, 8, 0),
        ]);
    });
});