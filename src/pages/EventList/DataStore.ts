import { observable, action, computed, makeAutoObservable } from "mobx";
import { Event } from '../../domain-models'

class EventsDataStore {
  data: Event[] = [];
  lastCursor: string;
  firstCursor: string;
  constructor() {
    makeAutoObservable(this, {
      data: observable,
      lastCursor: observable,
      addNewEvent: action,
      updateEventsList: action,
      syncEventsList: action,
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

  syncEventsList(events: Event[]) {
    this.data = [ ...events, ...this.data]
  }

  setEventsList(events: Event[]) {
    this.data = events
  }

  setLastCursor(lastCursor: string) {
    this.lastCursor = lastCursor
  }

  setFirstCursor(firstCursor: string) {
    this.firstCursor = firstCursor
  }

  get eventsList() {
    return this.data;
  }

  getLastCursor() {
    return this.lastCursor;
  }

  getFirstCursor() {
    return this.firstCursor;
  }
}


export default EventsDataStore;
