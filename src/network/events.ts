
import axios from 'axios';




export const getEvents = async (url: string, page?: number, search?: string) => await axios.get(url, {
    query: {
      page: page,
      search_val: search
    }
  })