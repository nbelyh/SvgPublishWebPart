import * as React from 'react';
import { DefaultButton, Callout, IContextualMenuProps, Stack, IButtonProps, Icon, ActionButton, Text } from '@fluentui/react';
import { ColorPickerDialog } from './ColorPickerDialog'
import { PaletteColorPicker } from './PaletteColorPicker';
import { SwatchPalette } from './SwatchPalette';

const ColorPickerBlock = (props: {
  defaultColor?: string;
  color: string;
  setColor: (val: string) => void;
  onDismiss: () => void;
}) => {

  const [showDialog, setShowDialog] = React.useState(false);

  const onSetColor = (val: string) => {
    props.setColor(val);
    props.onDismiss();
  };

  return (
    <Stack tokens={{ padding: 's1' }}>
      <PaletteColorPicker swatchPalette={SwatchPalette.basic} color={props.color} setColor={onSetColor} />
      <PaletteColorPicker swatchPalette={SwatchPalette.neutral} color={props.color} setColor={onSetColor} />
      <PaletteColorPicker swatchPalette={SwatchPalette.theme} color={props.color} setColor={onSetColor} />
      <ActionButton text={"Reset"} onClick={() => onSetColor(props.defaultColor)} />
      <ActionButton text={"Pick..."} onClick={() => setShowDialog(true)} />
      {showDialog && <ColorPickerDialog color={props.color} setColor={onSetColor} onDismiss={() => setShowDialog(false)} />}
    </Stack>
  );
};

export function ColorComboBox(props: {
  disabled?: boolean;
  text?: string;
  buttonColor: string;
  defaultColor?: string;
  title: string;
  iconName: string;
  color: string;
  setColor: (val: string) => void
  isSplit?: boolean;
}) {

  const renderDropdnown = (menuProps: IContextualMenuProps) => {

    return (
      <Callout target={menuProps.target} onDismiss={menuProps.onDismiss} isBeakVisible={false} styles={{ root: { border: 0 } }}>
        <Stack grow>
          <Stack.Item tokens={{ padding: '12px 12px 0 12px' }}><Text variant='large'>{props.title}</Text></Stack.Item>
          <ColorPickerBlock defaultColor={props.defaultColor} color={props.color} setColor={props.setColor} onDismiss={menuProps.onDismiss} />
        </Stack>
      </Callout>
    );
  };

  const renderIcon = (buttonProps: IButtonProps) => {
    return (
      <Stack>
        <Icon style={{ width: 24 }} iconName={buttonProps.iconProps.iconName} />
        <div style={{ backgroundColor: props.buttonColor, height: 4, marginTop: 2, paddingLeft: 2, paddingRight: 2 }} ></div>
      </Stack>
    );
  };

  const toolbarStyles: any = props.isSplit ? {
    splitButtonMenuButton: {
      border: 0,
      backgroundColor: 'transparent',
      width: 24
    },
    splitButtonDivider: {
      right: 23
    },
    root: {
      minWidth: 0,
      padding: 6,
      margin: '0 2px 0 2px 0',
      border: 0,
      backgroundColor: 'transparent'
    },
  } : {};

  return (
    <DefaultButton
      styles={toolbarStyles}
      onRenderIcon={renderIcon}
      iconProps={{ iconName: props.iconName }}
      text={props.text}
      title={props.title}
      split={props.isSplit}
      menuAs={renderDropdnown}
      onClick={() => props.setColor(props.buttonColor)}
      disabled={props.disabled}
      menuProps={{ items: [] }}
    />
  );
}
