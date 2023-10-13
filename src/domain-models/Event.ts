import EventAction from './EventAction'
import EventMetadata from './EventMetadata'

 interface Event {
  id: string;
  object: string;
  actorId: string;
  actorName: string;
  group: string;
  action: EventAction;
  targetId: string;
  targetName: string;
  location: string;
  occurredAt: string;
  metadata: EventMetadata;
}

export default Event
