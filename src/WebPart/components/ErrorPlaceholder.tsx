import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Placeholder } from 'min-sp-controls-react/controls/placeholder'
import * as React from 'react'

export const ErrorPlaceholder = (props: {
  context: WebPartContext;
  isReadOnly: boolean;
  error: string;
}) => {

  const isPropertyPaneOpen = props.context.propertyPane.isPropertyPaneOpen();
  const onConfigure = () => props.context.propertyPane.open();

  const placeholderIconName = props.error
    ? "Error"
    : "Edit";

  const placeholderIconText = props.error
    ? "Unable to show the diagram"
    : "The diagram is not selected";

  const isTeams = !!props.context.sdks?.microsoftTeams?.context;

  const placeholderDescription = isPropertyPaneOpen
    ? `Please click 'Browse...' Button on configuration panel to select the diagram.`
    : props.isReadOnly
      ? (isTeams
        ? `Please click 'Settings' menu on the Tab to reconfigure this web part.`
        : `Please click 'Edit' to start page editing to reconfigure this web part.`
      )
      : `Click 'Configure' button to reconfigure this web part.`;

  return (
    <Placeholder
      iconName={placeholderIconName}
      iconText={placeholderIconText}
      description={placeholderDescription}
      buttonLabel={"Configure"}
      onConfigure={onConfigure}
      hideButton={props.isReadOnly}
      disableButton={isPropertyPaneOpen}
    />
  );
}
