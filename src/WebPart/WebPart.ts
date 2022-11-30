import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { sp } from '@pnp/sp';

import { TopFrame } from './TopFrame';
import { PropertyPaneConfiguration } from './properties/PropertyPaneConfiguration';
import { IWebPartProps } from './IWebPartProps';

export default class WebPart extends BaseClientSideWebPart<IWebPartProps> {

  public onInit(): Promise<void> {

    return super.onInit().then(() => {
      sp.setup({ spfxContext: this.context as any });
    });
  }

  public render(): void {

    const isPropertyPaneOpen = this.context.propertyPane.isPropertyPaneOpen();

    const element = React.createElement(TopFrame, {
      webpart: {
        ...this.properties,
        width: this.properties.width || '100%',
        height: this.properties.height || '50vh'
      },
      isPropertyPaneOpen,
      onConfigure: () => this.context.propertyPane.open(),
      isReadOnly: this.displayMode === DisplayMode.Read,
      context: this.context,
      isTeams: !!this.context.sdks?.microsoftTeams?.context
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
