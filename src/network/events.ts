import { camelizeKeys } from 'humps';

import instance from './instance'
import { Event } from '../domain-models'

interface RequestFetchAllEventsArgs {
  lastCursor: string;
  searchText?: string;
  options?: {
    signal?: AbortSignal;
  }
}

interface RequestFetchAllEventsResponse {
  id: string;
  object: string;
  actor_id: string;
  actor_name: string;
  group: string;
  target_id: string;
  target_name: string;
  location: string;
  occurred_at: string;
  action: {
    id: string;
    object: string;
    name: string;
    event_id: string;
  };
  metadata: {
    id: string;
    redirect: string;
    description: string;
    x_request_id: string;
    event_id: string;
  }
}



const requestFetchAllEvents = async ({ lastCursor, searchText, options }: RequestFetchAllEventsArgs): Promise<Event[]> => {
  const { data } = await instance.get<RequestFetchAllEventsResponse>('/events/', {
    params: {
      last_cursor: lastCursor,
      search_val: searchText
    },
    signal: options?.signal,
  })
  return camelizeKeys(data);
}


interface RequestExportEventsArgs {
  searchText?: string;
  options?: {
    signal?: AbortSignal;
  }
}

const requestExportEvents = async ({ searchText, options }: RequestExportEventsArgs): Promise<Blob> => {
  const { data } = await instance.get<Blob>('/events/export/', {
    params: {
      search_val: searchText
    },
    responseType: 'blob',
    signal: options?.signal,
  }
  )

  return data;
}

export {
  requestFetchAllEvents,
  requestExportEvents
}