import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as strings from 'WebPartStrings';
import { Placeholder } from '../../min-sp-controls-react/controls/placeholder';

export const ErrorPlaceholder = (props: {
  context: WebPartContext;
  isReadOnly: boolean;
  error: string;
}) => {

  const isTeams = !!props.context.sdks?.microsoftTeams?.context;
  const isPropertyPaneOpen = props.context.propertyPane.isPropertyPaneOpen();
  const onConfigure = () => props.context.propertyPane.open();

  const placeholderIconName = props.error
    ? strings.Error
    : strings.Edit;

  const placeholderIconText = props.error
    ? strings.placeholderIconTextUnableShowVisio
    : strings.placeholderIconTextVisioNotSelected

  const placeholderDescription = isPropertyPaneOpen
    ? strings.placeholderIconTextPleaseclickBrowse
    : props.isReadOnly
      ? (isTeams
        ? strings.placeholderIconTextPleaseclickSettings
        : strings.placeholderIconTextPleaseclickEdit
      )
      : strings.placeholderIconTextPleaseclickConfigure

  return (
    <Placeholder
      iconName={placeholderIconName}
      iconText={placeholderIconText}
      description={props.error + ' ' + placeholderDescription}
      buttonLabel={strings.FieldConfigureLabel}
      onConfigure={onConfigure}
      hideButton={props.isReadOnly}
      disableButton={isPropertyPaneOpen}
    />
  );
};
