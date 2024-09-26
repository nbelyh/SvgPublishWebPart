import * as strings from 'WebPartStrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneToggle } from '@microsoft/sp-property-pane';

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
              groupName: strings.PropertyPaneLabelDrawingDisplay, // Drawing Display
              groupFields: [
                PropertyPaneUrlField('url', {
                  url: properties.url,
                  context: context,
                  getDefaultFolder: () => Defaults.getDefaultFolder(context),
                }),
              ]
            },
            {
              groupName: strings.PropertyPaneLabelAppearance,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableBreadcrumb', {
                  label: "Enable Breadcrumb",
                }),
                PropertyPaneToggle('enableHover', {
                  label: "Enable Hover",
                }),
                PropertyPaneToggle('enableSelection', {
                  label: "Enable Selection",
                }),
                PropertyPaneSizeField('width', {
                  label: strings.FieldWidth,
                  description: strings.FieldWidthDescription,
                  value: properties.width,
                  screenUnits: 'w',
                  getDefaultValue: () => Defaults.getDefaultWidth(context)
                }),

                PropertyPaneSizeField('height', {
                  label: strings.FieldHeight,
                  description: strings.FieldHeightDescription,
                  value: properties.height,
                  screenUnits: 'h',
                  getDefaultValue: () => Defaults.getDefaultHeight(context)
                }),
              ]
            },
            {
              groupName: strings.PropertyPaneLabelInteractivity,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enablePan', {
                  label: "Enable Pan",
                }),
                PropertyPaneToggle('enableZoom', {
                  label: "Enable Zoom",
                }),
              ]
            },
            {
              groupName: "Hyperlinks",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableLinks', {
                  label: "Enable Links",
                }),
                PropertyPaneToggle('enableFollowHyperlinks', {
                  label: "Follow Hyperlinks",
                }),
              ]
            },
            {
              groupName: strings.PropertyPaneLabelAbout,
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
