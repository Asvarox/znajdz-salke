import { SlotEntity } from '../rooms/providers/Interfaces';
import { format } from 'date-fns';
import { Form, InputGroup, Button } from 'react-bootstrap';


interface Props {
  onSubmit: () => void,
  slotDuration: number,
  onSlotDurationChange: (newDuration: number) => void,
  selectedSlot: SlotEntity | null,
  onSelectedSlotChange: (newSlot: SlotEntity) => void,
  filteredRoomsCount: number,
}

function SlotForm({ slotDuration, onSlotDurationChange, selectedSlot, onSelectedSlotChange, onSubmit, filteredRoomsCount }: Props) {
  const normalizeDateFromEvent = (dateString: string) => {
    const date = new Date(dateString);
    date.setSeconds(0);
    date.setMilliseconds(0);

    if (date.getMinutes() > 45) {
      date.setMinutes(0);
      date.setHours(date.getHours() + 1);
    } else if (date.getMinutes() > 15) {
      date.setMinutes(30);
    } else if (date.getMinutes() > 0) {
      date.setMinutes(0)
    };

    return date;
  }

  return (
    <Form className="mb-3">
      <Form.Group controlId='slot-length' className="mb-3">
        <Form.Label>
          Ile minimalnie ma trwać próba:
        </Form.Label>
        <InputGroup>
          <Button disabled={slotDuration <= 30} onClick={() => onSlotDurationChange(slotDuration - 30)}>-</Button>
          <Form.Control
            disabled
            style={{ textAlign: 'center' }}
            value={`${Math.floor(slotDuration / 60)}:${String(slotDuration - 60 * Math.floor(slotDuration / 60)).padStart(2, '0')}`}
          />
          <Button disabled={slotDuration >= 60 * 24} onClick={() => onSlotDurationChange(slotDuration + 30)}>+</Button>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='start-date' className="mb-3">
        <Form.Label>
          Początek
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="datetime-local"
            // id='start-date'
            value={selectedSlot ? format(selectedSlot!.start, 'yyyy-MM-dd\'T\'HH:mm') : ''}
            onChange={e => {
              const normalizedDate = normalizeDateFromEvent(e.target.value);
              onSelectedSlotChange({ end: selectedSlot?.end ?? normalizedDate, start: normalizedDate });
            }}
            />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='end-date' className="mb-3">
        <Form.Label>
          Koniec
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="datetime-local"
            // id='end-date'
            value={selectedSlot ? format(selectedSlot!.end, 'yyyy-MM-dd\'T\'HH:mm') : ''}
            onChange={e => {
              const normalizedDate = normalizeDateFromEvent(e.target.value);
              onSelectedSlotChange({ start: selectedSlot?.start ?? normalizedDate, end: normalizedDate });
            }}
          />
        </InputGroup>
      </Form.Group>
      <div className="d-grid gap-2">
        <Button
           variant="primary"
          disabled={filteredRoomsCount === 0}
           onClick={onSubmit}
          >
            Pokaz dostępne ({filteredRoomsCount})
        </Button>
      </div>
    </Form>
  );
}

export default SlotForm;
