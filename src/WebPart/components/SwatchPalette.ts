import { IPalette } from '@fluentui/react';

export interface ISwatchPalette {
  nameId: string;
  colors: (keyof IPalette)[];
}

export class SwatchPalette {

  public static basic: ISwatchPalette = {
    nameId: 'SwatchPalette_Basic',
    colors: [
      'yellowDark',
      'yellow',
      'yellowLight',
      'orange',
      'orangeLight',
      'orangeLighter',
      'redDark',
      'red',
      'magentaDark',
      'magenta',
      'magentaLight',
      'purpleDark',
      'purple',
      'purpleLight',
      'blueDark',
      'blueMid',
      'blue',
      'blueLight',
      'tealDark',
      'teal',
      'tealLight',
      'greenDark',
      'green',
      'greenLight',
    ]
  };

  public static neutral: ISwatchPalette = {
    nameId: 'SwatchPalette_Neutral',
    colors: [
      'black',
      'neutralDark',
      'neutralPrimary',
      'neutralPrimaryAlt',
      'neutralSecondary',
      'neutralSecondaryAlt',
      'neutralTertiary',
      'neutralTertiaryAlt',
      'neutralQuaternary',
      'neutralQuaternaryAlt',
      'neutralLight',
      'neutralLighter',
      'neutralLighterAlt',
    ]
  };

  public static theme: ISwatchPalette = {
    nameId: 'SwatchPalette_Theme',
    colors: [
      'themeDarker',
      'themeDark',
      'themeDarkAlt',
      'themePrimary',
      'themeSecondary',
      'themeTertiary',
      'themeLight',
      'themeLighter',
      'themeLighterAlt',
    ]
  };
}

