import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { sp } from '@pnp/sp';

import { TopFrame } from './TopFrame';
import { Configuration } from './properties/Configuration';
import { IWebPartProps } from './IWebPartProps';
import { DefaultColors } from 'svgpublish';

export default class WebPart extends BaseClientSideWebPart<IWebPartProps> {

  setDefault (property: keyof IWebPartProps, value: any) {
    if (typeof this.properties[property as string] === 'undefined') {
      this.properties[property as string] = value;
    }
  }

  public async onInit() {

    await super.onInit();

    this.setDefault('width', '100%');
    this.setDefault('height', '50vh');
    this.setDefault('url', '');
    this.setDefault('enablePan', true);
    this.setDefault('enableZoom', true);
    this.setDefault('enableLinks', true);
    this.setDefault('enableHeader', true);
    this.setDefault('enableBreadcrumb', true);
    this.setDefault('enableUsageLog', false);
    this.setDefault('enableCopyHashLink', false);
    this.setDefault('forceOpeningOfficeFilesOnline', true);
    this.setDefault('rewriteVsdxHyperlinks', false);
    this.setDefault('rewriteDocxHyperlinks', false);
    this.setDefault('usageLogListTitle', 'UsageLog');
    this.setDefault('enableFeedback', false);
    this.setDefault('feedbackButtonText', 'Feedback');
    this.setDefault('enableSelection', true);
    this.setDefault('enableBoxSelection', false);
    this.setDefault('selectionMode', 'normal');
    this.setDefault('enableFollowHyperlinks', true);
    this.setDefault('enableHover', true);
    this.setDefault('openHyperlinksInNewWindow', true);
    this.setDefault('hyperlinkColor', DefaultColors.hyperlinkColor);
    this.setDefault('selectionColor', DefaultColors.selectionColor);
    this.setDefault('hoverColor', DefaultColors.hoverColor);
    this.setDefault('dilate', 2);
    this.setDefault('enableDilate', true);
    this.setDefault('blur', 2);
    this.setDefault('enableBlur', true);
    this.setDefault('connDilate', 1);
    this.setDefault('enableConnDilate', false);
    this.setDefault('enablePrevShapeColor', false);
    this.setDefault('enableNextShapeColor', false);
    this.setDefault('enablePrevConnColor', false);
    this.setDefault('enableNextConnColor', false);
    this.setDefault('prevShapeColor', DefaultColors.prevShapeColor);
    this.setDefault('nextShapeColor', DefaultColors.nextShapeColor);
    this.setDefault('prevConnColor', DefaultColors.prevConnColor);
    this.setDefault('nextConnColor', DefaultColors.nextConnColor);

    sp.setup({ spfxContext: this.context as any });
  }

  public render(): void {

    const element = React.createElement(TopFrame, {
      webpart: this.properties,
      isReadOnly: this.displayMode === DisplayMode.Read,
      context: this.context,
    });

    ReactDom.render(element, this.domElement);
  }

  public onPropertyPaneConfigurationStart() {
    this.render();
  }

  public onPropertyPaneConfigurationComplete() {
    this.render();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return Configuration.get(this.context, this.properties)
  }
}
