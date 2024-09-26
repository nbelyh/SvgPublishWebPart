import * as React from 'react';
import * as strings from 'WebPartStrings';
import { Placeholder } from '../../min-sp-controls-react/controls/placeholder';

export const ErrorPlaceholder = (props: {
  error: string;
}) => {

  const placeholderIconName = strings.Error;
  const placeholderIconText = strings.placeholderIconTextUnableShowVisio

  return (
    <Placeholder
      iconName={placeholderIconName}
      iconText={placeholderIconText}
      description={props.error}
      buttonLabel={strings.FieldConfigureLabel}
      hideButton
    />
  );
};
