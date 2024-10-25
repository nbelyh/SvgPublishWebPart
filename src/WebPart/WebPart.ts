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

  public onInit(): Promise<void> {

    return super.onInit().then(() => {

      if (typeof this.properties.width === 'undefined') {
        this.properties.width = '100%';
      }
      if (typeof this.properties.height === 'undefined') {
        this.properties.height = '50vh';
      }
      if (typeof this.properties.url === 'undefined') {
        this.properties.url = '';
      }
      if (typeof this.properties.enablePan === 'undefined') {
        this.properties.enablePan = true;
      }
      if (typeof this.properties.enableZoom === 'undefined') {
        this.properties.enableZoom = true;
      }
      if (typeof this.properties.enableLinks === 'undefined') {
        this.properties.enableLinks = true;
      }
      if (typeof this.properties.enableHeader === 'undefined') {
        this.properties.enableHeader = true;
      }
      if (typeof this.properties.enableBreadcrumb === 'undefined') {
        this.properties.enableBreadcrumb = true;
      }
      if (typeof this.properties.enableFeedback === 'undefined') {
        this.properties.enableFeedback = false;
      }
      if (typeof this.properties.feedbackButtonText === 'undefined') {
        this.properties.feedbackButtonText = 'Feedback';
      }
      if (typeof this.properties.enableSelection === 'undefined') {
        this.properties.enableSelection = true;
      }
      if (typeof this.properties.enableBoxSelection === 'undefined') {
        this.properties.enableBoxSelection = false;
      }
      if (typeof this.properties.selectionMode === 'undefined') {
        this.properties.selectionMode = 'normal';
      }
      if (typeof this.properties.enableFollowHyperlinks === 'undefined') {
        this.properties.enableFollowHyperlinks = true;
      }
      if (typeof this.properties.enableHover === 'undefined') {
        this.properties.enableHover = true;
      }
      if (typeof this.properties.openHyperlinksInNewWindow === 'undefined') {
        this.properties.openHyperlinksInNewWindow = true;
      }
      if (typeof this.properties.hyperlinkColor === 'undefined') {
        this.properties.hyperlinkColor = DefaultColors.hyperlinkColor;
      }
      if (typeof this.properties.selectColor === 'undefined') {
        this.properties.selectColor = DefaultColors.selectionColor;
      }
      if (typeof this.properties.hoverColor === 'undefined') {
        this.properties.hoverColor = DefaultColors.hoverColor;
      }
      if (typeof this.properties.dilate === 'undefined') {
        this.properties.dilate = 4;
      }
      if (typeof this.properties.enableDilate === 'undefined') {
        this.properties.enableDilate = true;
      }
      if (typeof this.properties.blur === 'undefined') {
        this.properties.blur = 4;
      }
      if (typeof this.properties.enableBlur === 'undefined') {
        this.properties.enableBlur = false;
      }
      if (typeof this.properties.connDilate === 'undefined') {
        this.properties.connDilate = 1;
      }
      if (typeof this.properties.enableConnDilate === 'undefined') {
        this.properties.enableConnDilate = false;
      }
      if (typeof this.properties.enablePrevShapeColor === 'undefined') {
        this.properties.enablePrevShapeColor = false;
      }
      if (typeof this.properties.enableNextShapeColor === 'undefined') {
        this.properties.enableNextShapeColor = false;
      }
      if (typeof this.properties.enablePrevConnColor === 'undefined') {
        this.properties.enablePrevConnColor = false;
      }
      if (typeof this.properties.enableNextConnColor === 'undefined') {
        this.properties.enableNextConnColor = false;
      }
      if (typeof this.properties.prevShapeColor === 'undefined') {
        this.properties.prevShapeColor = DefaultColors.prevShapeColor;
      }
      if (typeof this.properties.nextShapeColor === 'undefined') {
        this.properties.nextShapeColor = DefaultColors.nextShapeColor;
      }
      if (typeof this.properties.prevConnColor === 'undefined') {
        this.properties.prevConnColor = DefaultColors.prevConnColor;
      }
      if (typeof this.properties.nextConnColor === 'undefined') {
        this.properties.nextConnColor = DefaultColors.nextConnColor;
      }

      sp.setup({ spfxContext: this.context as any });
    });
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
