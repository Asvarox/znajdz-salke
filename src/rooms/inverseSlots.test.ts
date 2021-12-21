import { SlotEntity, DateObject } from "./providers/Interfaces";
import inverseSlots from "./inverseSlots";

describe('inverseSlots', () => {
    const generateSlot = (from: DateObject, hourFrom: number, minuteFrom: number, to: DateObject, hourTo: number, minuteTo: number): SlotEntity => ({
        start: new Date(from.year, from.month - 1, from.day, hourFrom, minuteFrom),
        end: new Date(to.year, to.month - 1, to.day, hourTo, minuteTo),
    });

    it('should generate a list of free slots when booked slot is not starting from the day', () => {
        const from = { year: 2021, month: 12, day: 13 };
        const to = { year: 2021, month: 12, day: 20 };

        const bookedSlots: SlotEntity[] = [
            generateSlot(from, 4, 0, from, 5, 0),
            generateSlot(from, 6, 0, from, 7, 0),
        ];

        const expected: SlotEntity[] = [
            generateSlot(from, 0, 0, from, 4, 0),
            generateSlot(from, 5, 0, from, 6, 0),
            generateSlot(from, 7, 0, to, 24, 0),
        ];

        const result = inverseSlots(from, to, bookedSlots);
        expect(result).toEqual(expected);
    });

    it('should generate a list of free slots when booked slot is starting from the day', () => {
        const from = { year: 2021, month: 12, day: 13 };
        const to = { year: 2021, month: 12, day: 20 };

        const bookedSlots: SlotEntity[] = [
            generateSlot(from, 0, 0, from, 5, 0),
            generateSlot(from, 6, 0, from, 7, 0),
        ];

        const expected: SlotEntity[] = [
            generateSlot(from, 5, 0, from, 6, 0),
            generateSlot(from, 7, 0, to, 24, 0),
        ];

        const result = inverseSlots(from, to, bookedSlots);
        expect(result).toEqual(expected);
    });
});