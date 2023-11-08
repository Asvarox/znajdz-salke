import { SlotEntity } from '../rooms/providers/Interfaces';
import { RoomStatus } from '../rooms/findFreeSlots';
import { format } from 'date-fns';
import { Col, Modal, Row, Card } from 'react-bootstrap';
import { useMemo } from 'react';
import { shuffle } from 'lodash'; 

interface Props {
  rooms: RoomStatus[],
  selectedSlot: SlotEntity | null,
  show: boolean,
  onClose: () => void,
}

function Results(props: Props) {
  const shuffledRooms = useMemo(() => shuffle(props.rooms), [props.rooms])

  return (
      <Modal show={props.show} onHide={props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>
          {props.selectedSlot && `Salki dostępne w okresie ${format(props.selectedSlot.start, 'yyyy-MM-dd HH:mm')}-${format(props.selectedSlot.end, 'HH:mm')}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {shuffledRooms.map(room => {
            return (
              <Card style={{ margin: '1rem 0' }} key={`${room.name} ${room.address}`}>
                <Row>
                  <Col xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="p-3">
                    <Card.Img variant="top" src={room.metaData.logo} />
                  </Col>
                  <Col xs={8}>
                    <Card.Body>
                      <Card.Title>{room.metaData.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        <span style={{ color: room.color }}>■ </span>
                        {room.name} ({room.address})
                      </Card.Subtitle>
                      <Card.Link href={room.metaData.bookingUrl} target="_blank">Przejdź do rezerwacji</Card.Link>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Modal.Body>
      </Modal>
  );
}

export default Results;
