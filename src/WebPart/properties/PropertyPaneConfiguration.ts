import * as strings from 'WebPartStrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';

import { PropertyPaneVersionField } from './PropertyPaneVersionField';
import { PropertyPaneUrlField } from './PropertyPaneUrlField';
import { PropertyPaneSizeField } from './PropertyPaneSizeField';
import { Defaults } from './Defaults';
import { IWebPartProps } from 'WebPart/IWebPartProps';

export class PropertyPaneConfiguration {

  public static get(context: WebPartContext, properties: IWebPartProps): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Drawing Display",
              groupFields: [
                PropertyPaneUrlField('url', {
                  url: properties.url,
                  context: context,
                  getDefaultFolder: () => Defaults.getDefaultFolder(context),
                }),
              ]
            },
            {
              groupName: "Appearance",
              isCollapsed: true,
              groupFields: [
                PropertyPaneSizeField('width', {
                  label: strings.FieldWidth,
                  description: "Specify width value and units",
                  value: properties.width,
                  screenUnits: 'w',
                  getDefaultValue: () => Defaults.getDefaultWidth(context)
                }),

                PropertyPaneSizeField('height', {
                  label: strings.FieldHeight,
                  description: "Specify height value and units",
                  value: properties.height,
                  screenUnits: 'h',
                  getDefaultValue: () => Defaults.getDefaultHeight(context)
                }),
              ]
            },
            {
              groupName: "About",
              isCollapsed: true,
              groupFields: [
                PropertyPaneVersionField(context.manifest.version)
              ]
            }
          ]
        }
      ]
    };
  }

}
