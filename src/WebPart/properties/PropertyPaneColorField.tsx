import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IPropertyPaneField, PropertyPaneFieldType, IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';

import { PropertyPaneColorFieldComponent } from './PropertyPaneColorFieldComponent'

export function PropertyPaneColorField(targetProperty: string, props: {
  value: string;
  label: string;
  defaultValue: string;
  description: string;
}): IPropertyPaneField<IPropertyPaneCustomFieldProps> {

  return {
    targetProperty: targetProperty,
    type: PropertyPaneFieldType.Custom,
    properties: {
      key: targetProperty,

      onRender: (parent: HTMLElement, context: any, changeCallback: (targetProperty: string, newValue: any) => void) => {
        return ReactDom.render(
          <PropertyPaneColorFieldComponent
            value={props.value}
            defaultValue={props.defaultValue}
            label={props.label}
            description={props.description}
            setValue={(val) => changeCallback(targetProperty, val)}
          />, parent);
      },

      onDispose(parent: HTMLElement): void {
        ReactDom.unmountComponentAtNode(parent);
      }
    }
  };
}
