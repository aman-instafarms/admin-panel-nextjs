"use client";

import { Datepicker, TextInput } from "flowbite-react";
import { DateTime } from "luxon";
import React, { ChangeEvent, useEffect, useState } from "react";

interface TimeSelectorProps {
  timestamp: string | null;
  update: (timestamp: string | null) => void;
}

const parseTimeStr = (str: string): { hour: number; minute: number } | null => {
  if (str.length !== 5) {
    return null;
  }
  const split = str.split(":");
  if (split.length !== 2) {
    return null;
  } else {
    const [hourStr, minStr] = split;
    const hour = Number(hourStr);
    const minute = Number(minStr);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return null;
    } else {
      const time = DateTime.fromObject({ hour, minute });
      if (time.isValid) {
        return { hour, minute };
      } else {
        return null;
      }
    }
  }
};

export default function DatetimeSelector(props: TimeSelectorProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [timeStr, setTimeStr] = useState<string>("");

  const updateDate = (d: Date | null) => {
    if (d) {
      setDate(d);
    } else {
      setDate(null);
    }
    const time = parseTimeStr(timeStr);
    if (time && d) {
      const dt = DateTime.fromObject({
        ...DateTime.fromJSDate(d).toObject(),
        ...time,
      });
      props.update(dt.toSQL());
    }
  };

  const updateTime = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.target.value;
    const time = parseTimeStr(text);
    if (time && date) {
      const newTime = DateTime.fromObject({
        ...DateTime.fromJSDate(date).toObject,
        hour: time.hour,
        minute: time.minute,
      });
      props.update(newTime.toSQL());
      setTimeStr(newTime.toFormat("HH:mm"));
    } else if (time) {
      const newTime = DateTime.fromObject({
        hour: time.hour,
        minute: time.minute,
      });
      setTimeStr(newTime.toFormat("HH:mm"));
      props.update(null);
    } else {
      setTimeStr(text);
      props.update(null);
    }
  };

  useEffect(() => {
    if (props.timestamp) {
      const time = DateTime.fromSQL(props.timestamp);
      if (time.isValid) {
        setTimeStr(time.toFormat("HH:mm"));
      } else {
        props.update(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-row gap-2">
      <Datepicker className="flex-grow" value={date} onChange={updateDate} />
      <TextInput
        className="w-24"
        value={timeStr}
        placeholder="HH:mm"
        onChange={updateTime}
        color={props.timestamp ? "success" : "failure"}
      />
    </div>
  );
}
