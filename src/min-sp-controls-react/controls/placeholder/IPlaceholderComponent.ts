/**
 * Used to display a placeholder in case of no or temporary content. Button is optional.
 *
 */
export interface IPlaceholderProps {

  /**
   * Text description or component for the placeholder. Appears bellow the Icon and IconText.
   */
  description: string | ((defaultClassNames: string) => React.ReactElement);
  /**
   * Icon name used for the className from the MDL2 set. Example: 'Add'.
   */
  iconName: string;
  /**
   * Heading displayed against the Icon.
   */
  iconText: string | ((defaultClassNames: string) => React.ReactElement);
  /**
   * Text label to be displayed on button below the description.
   * Optional: As the button is optional.
   */
  buttonLabel?: string;
  /**
   * This className is applied to the root element of content. Use this to
   * apply custom styles to the placeholder.
   */
  contentClassName?: string;
  /**
   * Specify if you want to hide the config button
   */
  hideButton?: boolean;
  /**
   * Specify if you want to hide the config button
   */
   disableButton?: boolean;
   /**
   * onConfigure handler for the button.
   * Optional: As the button is optional.
   */
  onConfigure?: () => void;
}

export interface IPlaceholderState {
  width: number;
}
