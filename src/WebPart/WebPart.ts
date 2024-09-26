import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { sp } from '@pnp/sp';

import { TopFrame } from './TopFrame';
import { PropertyPaneConfiguration } from './properties/PropertyPaneConfiguration';
import { IWebPartProps } from './IWebPartProps';
import { Defaults } from './properties/Defaults';

export default class WebPart extends BaseClientSideWebPart<IWebPartProps> {

  public onInit(): Promise<void> {

    return super.onInit().then(() => {
      sp.setup({ spfxContext: this.context as any });
    });
  }

  public render(): void {

    const webpart = {
      ...this.properties,
      width: this.properties.width || '100%',
      height: this.properties.height || '50vh',
      enablePan: this.properties.enablePan ?? true,
      enableZoom: this.properties.enableZoom ?? true,
      enableLinks: this.properties.enableLinks ?? true,
      enableBreadcrumb: this.properties.enableBreadcrumb ?? true,
      enableSelection: this.properties.enableSelection ?? true,
      enableBoxSelection: this.properties.enableBoxSelection ?? false,
      selectionMode: this.properties.selectionMode || 'normal',
      enableFollowHyperlinks: this.properties.enableFollowHyperlinks ?? true,
      enableHover: this.properties.enableHover ?? true,
      openHyperlinksInNewWindow: this.properties.openHyperlinksInNewWindow ?? true,
      hyperlinkColor: this.properties.hyperlinkColor || Defaults.hyperlinkColor,
      selectColor: this.properties.selectColor || Defaults.selectColor,
      hoverColor: this.properties.hoverColor || Defaults.hoverColor,
    };

    const element = React.createElement(TopFrame, {
      webpart,
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
    return PropertyPaneConfiguration.get(this.context, this.properties)
  }
}
