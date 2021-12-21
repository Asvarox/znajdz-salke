import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateObject, SlotEntity } from '../rooms/providers/Interfaces';
import format from 'date-fns/format';
import plLocale from '@fullcalendar/core/locales/pl';
import { pl } from 'date-fns/locale'

const dateToObj = (date: Date): DateObject => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
});

interface Props {
  bookedSlots: SlotEntity[],
  freeSlots: SlotEntity[],
  onSelect:(slot: SlotEntity) => void,
  onDateChange: (start: DateObject, end: DateObject) => void;
}

function Calendar(props: Props, ref: React.ForwardedRef<FullCalendar>) {
  return (
      <FullCalendar
        ref={ref}
        height={'auto'}
        events={[
          ...props.bookedSlots.map(slot => ({
            start: slot.start,
            end: slot.end,
            title: 'All occupied',
          })),
          ...props.freeSlots.map(slot => ({
            start: slot.start,
            end: slot.end,
            title: 'Free',
            display: 'background',
          })),
        ]}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek'
        slotDuration={'01:00:00'}
        eventDisplay='block'
        firstDay={1}
        selectable
        selectOverlap={event => event.display === 'background'}
        select={data => {
          props.onSelect({ start: data.start, end: data.end });
        }}
        datesSet={data => {
          props.onDateChange(dateToObj(data.start), dateToObj(data.end));
        }}
        themeSystem='bootstrap'
        allDaySlot={false}
        selectLongPressDelay={600}
        dayHeaderContent={props => format(props.date, 'E\'\n\'dd', { locale: pl })}
        locale={plLocale}
      />
  );
}

export default React.forwardRef<FullCalendar, Props>(Calendar);
