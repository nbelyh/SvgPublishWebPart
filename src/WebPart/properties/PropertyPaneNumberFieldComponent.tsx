import * as React from 'react';
import { TextField } from '@fluentui/react';

export function PropertyPaneNumberFieldComponent(props: {
  value: number;
  setValue: (value: number) => void;
  label: string;
  disabled?: boolean;
}) {

  return (
    <TextField
      label={props.label}
      disabled={props.disabled}
      type='number'
      value={props.value?.toString() ?? ''}
      onChange={(_, newValue) => props.setValue(newValue ? parseFloat(newValue) : undefined)} />
  );
}
