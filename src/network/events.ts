import { camelizeKeys } from 'humps';

import instance from './instance'
import { Event } from '../domain-models'

interface RequestFetchAllEventsArgs {
  lastCursor?: string;
  searchText?: string;
  options?: {
    signal?: AbortSignal;
  }
}

interface RequestFetchAllEventsResponse {
  metadata: {
    last_cursor: string;
    first_cursor: string;
  };
  data: Array<{
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
  }>
}

const requestFetchAllEvents = async ({ lastCursor, searchText, options }: RequestFetchAllEventsArgs): Promise<{
  metadata: {
    lastCursor;
    firstCursor;
  };
  data: Event[];
}> => {
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

interface RequestSyncEventsArgs {
  firstCursor?: string;
  options?: {
    signal?: AbortSignal;
  }
}

interface RequestSyncEventsResponse {
  metadata: {
    first_cursor: string;
  };
  data: Array<{
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
  }>
}

const requestSyncEvents = async ({ firstCursor, options }: RequestSyncEventsArgs): Promise<{
  metadata: {
    firstCursor;
  };
  data: Event[];
}> => {
  const { data } = await instance.get<RequestSyncEventsResponse>('/events/sync', {
    params: {
      first_cursor: firstCursor,
    }
  })
  return camelizeKeys(data);
}

export {
  requestFetchAllEvents,
  requestExportEvents,
  requestSyncEvents
}