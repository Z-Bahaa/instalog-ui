import { observable, action, computed, makeAutoObservable } from "mobx";
import Event from '../../domain-models'

class EventsDataStore {
  data: Event[] = [];

  constructor() {
    makeAutoObservable(this, {
      data: observable,
      addEvent: action,
      addEventList: action,
      updateEventsList: action,
      eventsList: computed,
    });
  }

  addNewEvent(newEvent: Event) {
    this.data.unshift(newEvent)
  }

  addEventsList(events: Event[]) {
    this.data.concat(events)
  }

  updateEventsList(events: Event[]) {
    this.data = (events)
  }

  get eventsList() {
    return this.data;
  }
}


export default EventsDataStore;
