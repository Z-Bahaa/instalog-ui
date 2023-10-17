import { observable, action, computed, makeAutoObservable } from "mobx";
import { Event } from '../../domain-models'

class EventsDataStore {
  data: Event[] = [];
  lastCursor: string;
  constructor() {
    makeAutoObservable(this, {
      data: observable,
      lastCursor: observable,
      addNewEvent: action,
      updateEventsList: action,
      setEventsList: action,
      eventsList: computed,
    });
  }

  addNewEvent(newEvent: Event) {
    this.data = [newEvent, ...this.data]
  }

  updateEventsList(events: Event[]) {
    this.data = [...this.data, ...events]
  }

  setEventsList(events: Event[]) {
    this.data = events
  }

  setLastCursor(lastCursor: string) {
    this.lastCursor = lastCursor
  }

  get eventsList() {
    return this.data;
  }

  getLastCursor() {
    return this.lastCursor;
  }
}


export default EventsDataStore;
