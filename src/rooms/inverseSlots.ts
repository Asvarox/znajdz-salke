import { addDays, isAfter } from "date-fns";
import { SlotEntity, DateObject } from "./providers/Interfaces";

function isBeforeOrEqual(a: Date, b: Date): boolean {
    return !isAfter(a, b);
}

export default function inverseSlots(from: DateObject, to: DateObject, slots: SlotEntity[]): SlotEntity[] {
    if (slots.length === 0) {
        return [];
    }

    const startingDate = new Date(from.year, from.month - 1, from.day);
    const endingDate = addDays(new Date(to.year, to.month - 1, to.day), 1);

    const inversedSlots: SlotEntity[] = isBeforeOrEqual(slots[0].start, startingDate) ? [] : [{ start: startingDate, end: slots[0].start }];

    for (let i = 0; i < slots.length - 1; i++) {
        inversedSlots.push({ start: slots[i].end, end: slots[i + 1].start });
    }

    const lastBookedSlot = slots[slots.length - 1];
    
    if (isBeforeOrEqual(lastBookedSlot.end, endingDate)) {
        inversedSlots.push({ start: lastBookedSlot.end, end: endingDate });
    }

    return inversedSlots;
}
