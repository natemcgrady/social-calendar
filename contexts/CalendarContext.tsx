import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";
import calendarsData from "../db/calendars.json";

export interface Calendar {
  id: number;
  title: string;
}

interface CalendarContextType {
  calendars: Calendar[];
  addCalendar: (calendar: Calendar) => void;
  deleteCalendar: (id: number) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

interface CalendarProviderProps {
  children: ReactNode;
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [calendars, setCalendars] = useState<Calendar[]>(
    calendarsData.calendars as Calendar[]
  );

  const addCalendar = (calendar: Calendar) => {
    setCalendars((prev) => [...prev, calendar]);
  };

  const deleteCalendar = (id: number) => {
    setCalendars((prev) => prev.filter((cal) => cal.id !== id));
  };

  return (
    <CalendarContext.Provider
      value={{
        calendars,
        addCalendar,
        deleteCalendar,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendars() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendars must be used within a CalendarProvider");
  }
  return context;
}

