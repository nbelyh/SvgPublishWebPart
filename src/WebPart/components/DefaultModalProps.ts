import { ContextualMenu, IModalProps } from '@fluentui/react';

export const defaultModalProps: IModalProps = {
  isBlocking: true,
  dragOptions: {
    moveMenuItemText: "Move",
    closeMenuItemText: "Close",
    menu: ContextualMenu,
    keepInBounds: true,
  }
};
