import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import {
  adjustEndTimeIfNeeded,
  isAllDayEvent,
  parseDateString,
} from "../utils/eventFormUtils";

interface EventFormData {
  title: string;
  from: string;
  to: string;
}

interface UseEventFormProps {
  visible: boolean;
  initialDate?: string;
  eventToEdit?: EventFormData | null;
}

export function useEventForm({
  visible,
  initialDate,
  eventToEdit,
}: UseEventFormProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialDate ? parseDateString(initialDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialDate ? parseDateString(initialDate) : undefined
  );
  const [fromTime, setFromTime] = useState<Date>(new Date());
  const [toTime, setToTime] = useState<Date>(() => {
    const defaultToTime = new Date();
    defaultToTime.setHours(defaultToTime.getHours() + 1);
    return defaultToTime;
  });
  const [tempFromTime, setTempFromTime] = useState<Date>(new Date());
  const [tempToTime, setTempToTime] = useState<Date>(() => {
    const defaultToTime = new Date();
    defaultToTime.setHours(defaultToTime.getHours() + 1);
    return defaultToTime;
  });
  const [isAllDay, setIsAllDay] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);

  const isInitialMount = useRef(true);

  // Initialize temp times when pickers open
  useEffect(() => {
    if (showFromTimePicker) {
      setTempFromTime(fromTime);
    }
  }, [showFromTimePicker, fromTime]);

  useEffect(() => {
    if (showToTimePicker) {
      setTempToTime(toTime);
    }
  }, [showToTimePicker, toTime]);

  // Initialize form when modal opens
  useEffect(() => {
    if (visible) {
      if (eventToEdit) {
        const fromDate = new Date(eventToEdit.from);
        const toDate = new Date(eventToEdit.to);
        setTitle(eventToEdit.title);
        setStartDate(fromDate);
        setEndDate(toDate);
        setFromTime(fromDate);
        setToTime(toDate);
        setTempFromTime(fromDate);
        setTempToTime(toDate);
        setIsAllDay(isAllDayEvent(eventToEdit.from, eventToEdit.to));
      } else if (initialDate) {
        const date = parseDateString(initialDate);
        setStartDate(date);
        setEndDate(date);
        if (isInitialMount.current) {
          const defaultFromTime = new Date();
          const defaultToTime = new Date();
          defaultToTime.setHours(defaultToTime.getHours() + 1);
          setFromTime(defaultFromTime);
          setToTime(defaultToTime);
          isInitialMount.current = false;
        }
      } else {
        const now = new Date();
        setStartDate(now);
        setEndDate(now);
        if (isInitialMount.current) {
          const defaultFromTime = new Date();
          const defaultToTime = new Date();
          defaultToTime.setHours(defaultToTime.getHours() + 1);
          setFromTime(defaultFromTime);
          setToTime(defaultToTime);
          isInitialMount.current = false;
        }
      }
    } else {
      isInitialMount.current = true;
    }
  }, [visible, initialDate, eventToEdit]);

  const handleStartDateSelect = (date: Date) => {
    setStartDate(date);
    if (endDate) {
      const adjustedTime = adjustEndTimeIfNeeded(
        date,
        endDate,
        fromTime,
        toTime
      );
      setToTime(adjustedTime);
    }
    setShowStartDatePicker(false);
  };

  const handleEndDateSelect = (date: Date) => {
    setEndDate(date);
    if (startDate) {
      const adjustedTime = adjustEndTimeIfNeeded(
        startDate,
        date,
        fromTime,
        toTime
      );
      setToTime(adjustedTime);
    }
    setShowEndDatePicker(false);
  };

  const handleFromTimeChange = (time: Date) => {
    setFromTime(time);
    if (startDate && endDate) {
      const adjustedTime = adjustEndTimeIfNeeded(
        startDate,
        endDate,
        time,
        toTime
      );
      setToTime(adjustedTime);
    }
  };

  const handleToTimeChange = (time: Date) => {
    if (startDate && endDate) {
      const adjustedTime = adjustEndTimeIfNeeded(
        startDate,
        endDate,
        fromTime,
        time
      );
      setToTime(adjustedTime);
    } else {
      setToTime(time);
    }
  };

  const handleFromTimeDone = () => {
    handleFromTimeChange(tempFromTime);
    setShowFromTimePicker(false);
  };

  const handleToTimeDone = () => {
    handleToTimeChange(tempToTime);
    setShowToTimePicker(false);
  };

  const resetForm = () => {
    setTitle("");
    setStartDate(undefined);
    setEndDate(undefined);
    setIsAllDay(false);
    const resetFromTime = new Date();
    setFromTime(resetFromTime);
    const resetToTime = new Date();
    resetToTime.setHours(resetToTime.getHours() + 1);
    setToTime(resetToTime);
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    setShowFromTimePicker(false);
    setShowToTimePicker(false);
  };

  const formatEventData = (): EventFormData | null => {
    if (!title.trim() || !startDate) return null;

    const startDateStr = format(startDate, "yyyy-MM-dd");
    const endDateStr = endDate ? format(endDate, "yyyy-MM-dd") : startDateStr;

    let from: string;
    let to: string;

    if (isAllDay) {
      from = `${startDateStr}T00:00:00`;
      to = `${endDateStr}T23:59:59`;
    } else {
      const formattedFromTime = format(fromTime, "HH:mm");
      const formattedToTime = format(toTime, "HH:mm");
      from = `${startDateStr}T${formattedFromTime}:00`;
      to = `${endDateStr}T${formattedToTime}:00`;
    }

    return {
      title: title.trim(),
      from,
      to,
    };
  };

  const isValid = Boolean(title.trim() && startDate);

  return {
    // State
    title,
    startDate,
    endDate,
    fromTime,
    toTime,
    tempFromTime,
    tempToTime,
    isAllDay,
    showStartDatePicker,
    showEndDatePicker,
    showFromTimePicker,
    showToTimePicker,
    // Setters
    setTitle,
    setStartDate,
    setEndDate,
    setFromTime,
    setToTime,
    setTempFromTime,
    setTempToTime,
    setIsAllDay,
    setShowStartDatePicker,
    setShowEndDatePicker,
    setShowFromTimePicker,
    setShowToTimePicker,
    // Handlers
    handleStartDateSelect,
    handleEndDateSelect,
    handleFromTimeChange,
    handleToTimeChange,
    handleFromTimeDone,
    handleToTimeDone,
    resetForm,
    formatEventData,
    isValid,
  };
}
