import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IPropertyPaneField, PropertyPaneFieldType, IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PropertyPaneUrlFieldComponent } from './PropertyPaneUrlFieldComponent';
import { IDefaultFolder } from '../services/IDefaultFolder';

export function PropertyPaneUrlField(targetProperty: string, props: {
  url: string;
  context: WebPartContext;
  getDefaultFolder: () => Promise<IDefaultFolder>;
}): IPropertyPaneField<IPropertyPaneCustomFieldProps> {

  return {
    targetProperty: targetProperty,
    type: PropertyPaneFieldType.Custom,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPaneUrlFieldComponent
            context={props.context}
            url={props.url}
            setUrl={(url) => changeCallback(targetProperty, url)}
            getDefaultFolder={props.getDefaultFolder}
          />, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
