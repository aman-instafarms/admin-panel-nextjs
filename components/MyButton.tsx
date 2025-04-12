"use client";

import { ButtonProps, Button, Spinner } from "flowbite-react";

interface MyButtonProps extends ButtonProps {
  loading?: boolean;
}

export default function MyButton(props: MyButtonProps) {
  return (
    <Button {...props} disabled={props.disabled || props.loading}>
      {props.loading && <Spinner size="sm" className="me-3" light />}
      {props.children}
    </Button>
  );
}
