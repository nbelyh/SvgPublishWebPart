import * as React from 'react';
import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton, Stack, getColorFromString, ColorPicker } from '@fluentui/react';

import { defaultModalProps } from './DefaultModalProps';
import { PaletteColorPicker } from './PaletteColorPicker';
import { SwatchPalette } from './SwatchPalette';

export function ColorPickerDialog(props: {
  color: string;
  setColor: (color: string) => void;
  onDismiss: () => void;
}) {

  const [selectedColor, setSelectedColor] = React.useState(props.color);

  return (
    <Dialog
      hidden={false}
      dialogContentProps={{ title: "Select Color", type: DialogType.normal, }}
      maxWidth={null}
      modalProps={defaultModalProps}
      onDismiss={props.onDismiss} >
      <Stack horizontal tokens={{ childrenGap: 'm' }}>
        <Stack>
          <PaletteColorPicker swatchPalette={SwatchPalette.basic} color={selectedColor} setColor={setSelectedColor} />
          <PaletteColorPicker swatchPalette={SwatchPalette.neutral} color={selectedColor} setColor={setSelectedColor} />
          <PaletteColorPicker swatchPalette={SwatchPalette.theme} color={selectedColor} setColor={setSelectedColor} />
        </Stack>
        <ColorPicker alphaType='alpha' color={getColorFromString(selectedColor)} onChange={(_, val) => setSelectedColor(val.str)} styles={{ panel: { padding: 0 } }} />
      </Stack>
      <DialogFooter>
        <PrimaryButton disabled={!selectedColor} onClick={() => props.setColor(selectedColor)} text="OK" />
        <DefaultButton onClick={props.onDismiss} text="Cancel" />
      </DialogFooter>
    </Dialog>
  );
}
