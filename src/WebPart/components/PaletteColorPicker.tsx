import * as React from 'react';
import { IPalette, SwatchColorPicker, Stack, Label, useTheme } from '@fluentui/react';
import { ISwatchPalette } from './SwatchPalette';
import * as strings from 'WebPartStrings';

export function PaletteColorPicker(props: {
  swatchPalette: ISwatchPalette;
  color: string;
  setColor: (color: string) => void;
}) {

  const theme = useTheme();

  const getStockColor = (name: keyof IPalette) => {
    return {
      id: theme.palette[name],
      color: theme.palette[name],
      label: name
    };
  };

  const name = strings[props.swatchPalette.nameId];

  return (
    <Stack>
      <Label style={{ paddingLeft: 4, paddingBottom: 0 }}>{name}</Label>
      <SwatchColorPicker
        columnCount={9}
        colorCells={props.swatchPalette.colors.map(k => getStockColor(k))}
        selectedId={props.color}
        cellShape='square'
        onColorChanged={(id, color) => props.setColor(color)}
      />
    </Stack>
  );
}
