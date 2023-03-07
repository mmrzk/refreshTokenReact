import { useEffect, useState } from "react";
import {
  createNotes1API,
  getNotes1API,
  createNotes2API,
  getNotes2API,
  createNotes3API,
  getNotes3API,
} from "../api";

export function useNotes(getApi, createApi, delay = 0) {
  const [notes, setNotes] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const getNotes = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, delay));
    const { data } = await getApi();
    setNotes(data);
    setIsLoading(false);
  };
  const create = async (val) => {
    await createApi(val);
    getNotes();
  };

  useEffect(() => {
    if (!notes) getNotes();
  }, []);

  return { create, notes, isLoading };
}

export function useNotes1(delay) {
  return useNotes(getNotes1API, createNotes1API, delay);
}

export function useNotes2(delay) {
  return useNotes(getNotes2API, createNotes2API, delay);
}

export function useNotes3(delay) {
  return useNotes(getNotes3API, createNotes3API, delay);
}
