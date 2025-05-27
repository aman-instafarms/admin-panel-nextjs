"use client";

import { TextInput } from "flowbite-react";
import { DateTime } from "luxon";
import React, { ChangeEvent, useEffect, useState } from "react";

interface TimeSelectorProps {
  timestamp: string | null;
  update: (timestamp: string | null) => void;
}

export default function TimeSelector(props: TimeSelectorProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.target.value;
    if (text.length !== 5) {
      setTimeStr(text);
      props.update(null);
    } else {
      const split = text.split(":");
      if (split.length !== 2) {
        setTimeStr(text);
        props.update(null);
      } else {
        const [hourStr, minStr] = split;
        const hour = Number(hourStr);
        const minute = Number(minStr);
        if (Number.isNaN(hour) || Number.isNaN(minute)) {
          setTimeStr(text);
          props.update(null);
        } else {
          const time = DateTime.fromObject({ hour, minute });
          if (time.isValid) {
            props.update(time.toSQL({ includeZone: true }));
            setTimeStr(time.toFormat("HH:mm"));
          } else {
            setTimeStr(text);
            props.update(null);
          }
        }
      }
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
    <TextInput
      value={timeStr}
      onChange={handleChange}
      color={!props.timestamp ? "failure" : "gray"}
    />
  );
}
