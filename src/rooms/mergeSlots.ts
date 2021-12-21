import { differenceInSeconds, isAfter, max } from "date-fns";
import { SlotEntity } from "./providers/Interfaces";

function isBeforeOrEqual(a: Date, b: Date): boolean {
    return !isAfter(a, b);
}

export default function mergeSlots(slots: SlotEntity[]): SlotEntity[] {
    if (slots.length === 0) {
        return [];
    }

    const orderedSlots = [...slots];
    orderedSlots.sort((a, b) => differenceInSeconds(a.start, b.start));

    const mergedSlots = [{ ...orderedSlots[0] }];

    let lastSlot = mergedSlots[0];
    orderedSlots.forEach(slot => {
        if (isBeforeOrEqual(slot.start, lastSlot.end)) {
            lastSlot.end = max([slot.end, lastSlot.end]);
        } else {
            mergedSlots.push({ ...slot })
            lastSlot = mergedSlots[mergedSlots.length - 1];
        }
    })

    return mergedSlots;
}
