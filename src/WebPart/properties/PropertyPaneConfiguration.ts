import * as strings from 'WebPartStrings';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneDropdown, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';

import { PropertyPaneVersionField } from './PropertyPaneVersionField';
import { PropertyPaneUrlField } from './PropertyPaneUrlField';
import { PropertyPaneSizeField } from './PropertyPaneSizeField';
import { WebPartDefaults } from './WebPartDefaults';
import { IWebPartProps } from 'WebPart/IWebPartProps';
import { PropertyPaneColorField } from './PropertyPaneColorField';
import { DefaultColors } from 'svgpublish';
import { PropertyPaneNumberField } from './PropertyPaneNumberField';

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
                  getDefaultFolder: () => WebPartDefaults.getDefaultFolder(context),
                }),
              ]
            },
            {
              groupName: strings.PropertyPaneLabelAppearance,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableBreadcrumb', {
                  label: "Enable Breadcrumb",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enablePan', {
                  label: "Enable Pan",
                  inlineLabel: true,
                }),
                PropertyPaneToggle('enableZoom', {
                  label: "Enable Zoom",
                  inlineLabel: true,
                }),
                PropertyPaneSizeField('width', {
                  label: strings.FieldWidth,
                  description: strings.FieldWidthDescription,
                  value: properties.width,
                  screenUnits: 'w',
                  getDefaultValue: () => WebPartDefaults.getDefaultWidth(context)
                }),
                PropertyPaneSizeField('height', {
                  label: strings.FieldHeight,
                  description: strings.FieldHeightDescription,
                  value: properties.height,
                  screenUnits: 'h',
                  getDefaultValue: () => WebPartDefaults.getDefaultHeight(context)
                }),
              ]
            },
            {
              groupName: "Selection",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableSelection', {
                  label: "Enable Selection",
                  inlineLabel: true,
                }),
                PropertyPaneColorField('selectColor', {
                  disabled: !properties.enableSelection,
                  defaultValue: DefaultColors.selectionColor,
                  value: properties.selectColor,
                }),
                PropertyPaneToggle('enableBoxSelection', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Use box selection",
                }),
                PropertyPaneDropdown('selectionMode', {
                  label: "Selection Mode",
                  disabled: !properties.enableSelection,
                  options: [
                    { key: 'normal', text: "normal" },
                    { key: 'lighten', text: "lighten" },
                    { key: 'darken', text: "darken" },
                  ],
                }),
                PropertyPaneToggle('enableDilate', {
                  label: "Enable Dilate",
                  inlineLabel: true,
                  disabled: !properties.enableSelection,
                }),
                PropertyPaneNumberField('dilate', {
                  disabled: !(properties.enableSelection && properties.enableDilate),
                  value: properties.dilate,
                }),

                PropertyPaneToggle('enableBlur', {
                  label: "Enable Blur",
                  inlineLabel: true,
                  disabled: !properties.enableSelection,
                }),
                PropertyPaneNumberField('blur', {
                  disabled: !(properties.enableSelection && properties.enableBlur),
                  value: properties.blur,
                }),

                PropertyPaneToggle('enablePrevShapeColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Previous Shape",
                }),
                PropertyPaneColorField('prevShapeColor', {
                  disabled: !(properties.enableSelection && properties.enablePrevShapeColor),
                  defaultValue: DefaultColors.prevShapeColor,
                  value: properties.prevShapeColor,
                }),

                PropertyPaneToggle('enableNextShapeColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Next Shape",
                }),
                PropertyPaneColorField('nextShapeColor', {
                  disabled: !(properties.enableSelection && properties.enableNextShapeColor),
                  defaultValue: DefaultColors.nextShapeColor,
                  value: properties.nextShapeColor,
                }),

                PropertyPaneToggle('enablePrevConnColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Previous Connection",
                }),
                PropertyPaneColorField('prevConnColor', {
                  disabled: !(properties.enableSelection && properties.enablePrevConnColor),
                  defaultValue: DefaultColors.prevConnColor,
                  value: properties.prevShapeColor,
                }),

                PropertyPaneToggle('enableNextConnColor', {
                  disabled: !properties.enableSelection,
                  inlineLabel: true,
                  label: "Highlight Next Connection",
                }),
                PropertyPaneColorField('nextConnColor', {
                  disabled: !(properties.enableSelection && properties.enableNextConnColor),
                  defaultValue: DefaultColors.nextConnColor,
                  value: properties.prevShapeColor,
                }),


              ]
            },
            {
              groupName: "Hover",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableHover', {
                  label: "Enable Hover",
                }),
                PropertyPaneColorField('hoverColor', {
                  disabled: !properties.enableHover,
                  defaultValue: DefaultColors.hoverColor,
                  value: properties.hoverColor,
                })
              ]
            },
            {
              groupName: "Hyperlinks",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('enableFollowHyperlinks', {
                  label: "Enable Links",
                }),
                PropertyPaneColorField('hyperlinkColor', {
                  disabled: !properties.enableFollowHyperlinks,
                  defaultValue: DefaultColors.hyperlinkColor,
                  value: properties.hyperlinkColor,
                }),
                PropertyPaneToggle('openHyperlinksInNewWindow', {
                  label: "Open Hyperlinks in New Window",
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
