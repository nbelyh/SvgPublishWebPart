import * as React from 'react';
import { Stack, Text, Label } from '@fluentui/react';
import { ColorComboBox } from '../components/ColorComboBox';

export function PropertyPaneColorFieldComponent(props: {
  value: string;
  setValue: (value: string) => void;
  label: string;
  defaultValue: string;
  description: string;
}) {

  return (
    <Stack tokens={{ childrenGap: 's2' }}>
      <Label>{props.label}</Label>
      <ColorComboBox
        text={props.value}
        buttonColor={props.value}
        defaultColor={props.defaultValue}
        title={props.label}
        iconName='Color'
        color={props.value}
        setColor={props.setValue}
        isSplit={false}
      />
      <Text variant='small' >{props.description}</Text>
    </Stack>
  );
}
