import { ContextualMenu, IModalProps } from '@fluentui/react';
import * as strings from 'WebPartStrings';

export const defaultModalProps: IModalProps = {
  isBlocking: true,
  dragOptions: {
    moveMenuItemText: "Move",
    closeMenuItemText: "Close",
    menu: ContextualMenu,
    keepInBounds: true,
  }
};
