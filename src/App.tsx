import 'bootstrap/dist/css/bootstrap.css';
import * as Sentry from "@sentry/react";
import { createRef, useEffect, useState } from 'react';
import { SlotEntity, DateObject } from './rooms/providers/Interfaces';
import findFreeSlots, { RoomStatus } from './rooms/findFreeSlots';
import mergeSlots from './rooms/mergeSlots';
import { isAfter, isBefore } from 'date-fns';
import Calendar from './components/Calendar';
import { Col, Container, Row, Navbar, Alert, Nav } from 'react-bootstrap';
import inverseSlots from './rooms/inverseSlots';
import rooms from './rooms';
import Results from './components/Results';
import FullCalendar from '@fullcalendar/react';
import SlotForm from './components/SlotForm';

const isShorterThan = (slot: SlotEntity, durationMinutes: number) => {
  return (slot.end.getTime() - slot.start.getTime()) < durationMinutes * 1000 * 60;
}

function App() {
  const [show, setShow] = useState(false);
  const [slotDuration, setSlotDuration] = useState(1 * 60);
  const [events, setEvents] = useState<RoomStatus[]>([]);
  const [start, setStart] = useState<DateObject | null>(null);
  const [end, setEnd] = useState<DateObject | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotEntity | null>(null);
  const [filteredRooms, setFilteredRooms] = useState<RoomStatus[]>([]);
  const calendar = createRef<FullCalendar>();

  useEffect(() => {
    if (!start || !end) {
      return;
    }

    const controller = new AbortController();
    const promises = rooms.map(room => room.getData(start, end, controller.signal)
      .then(data => findFreeSlots(start, end, data, room))
      .catch(e => {
        if (e instanceof DOMException) {
          console.warn(e);
        } else {
          Sentry.captureException(e);
        }

        return [];
      })
    );
    Promise.all(promises).then(roomData => setEvents(roomData.flat()));

    return () => controller.abort();
  }, [start, end]);

  const freeSlots = mergeSlots(events.reduce<SlotEntity[]>((events, room) => ([
    ...events, ...room.freeSlots.filter(slot => !isShorterThan(slot, slotDuration))
  ]), []));
  const bookedSlots = (start && end) ? inverseSlots(start, end, freeSlots) : [];

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
          Znajdź salkę
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="https://github.com/Asvarox/znajdz-salke/">GitHub</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Results rooms={filteredRooms} show={show} onClose={() => setShow(false)} selectedSlot={selectedSlot} />
      <Container className="mt-3">
        <Row>
          <Col xs={12} lg={{ span: 4, order: 'last' }}>
            <SlotForm
              slotDuration={slotDuration}
              onSlotDurationChange={newDuration => setSlotDuration(newDuration)}
              selectedSlot={selectedSlot}
              onSelectedSlotChange={newSlot => {
                setSelectedSlot(newSlot)
                calendar.current?.getApi().select(newSlot.start, newSlot.end)
              }}
              onSubmit={() => setShow(true)}
              filteredRoomsCount={filteredRooms.length}
            />
          </Col>
          <Col xs={12} lg={8}>
            <Alert variant="info" className="d-xs-block d-md-none">
              Przytrzymaj wybraną godzinę az nie podświetli się na czarno - wtedy przeciągnij aby określić długość.
            </Alert>
            <Calendar
              ref={calendar}
              bookedSlots={bookedSlots}
              freeSlots={freeSlots}
              onSelect={data => {
                const rooms = events.filter(event => event.freeSlots.find(slot => !(isAfter(data.end, slot.end) || isBefore(data.start, slot.start))));
                setSelectedSlot(data);

                setFilteredRooms(rooms);
              }}
              onDateChange={(start, end) => {
                setStart(start);
                setEnd(end);
                setEvents([]);
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
