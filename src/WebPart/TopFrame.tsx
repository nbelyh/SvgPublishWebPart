import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from './WebPart';
import { Placeholder } from '../min-sp-controls-react/controls/placeholder';
import { MessageBar, MessageBarType, ThemeProvider } from '@fluentui/react';
import { sp } from '@pnp/sp';
import { PanZoom } from './PanZoom';

interface ITopFrameProps extends IWebPartProps {
  context: WebPartContext;
  isPropertyPaneOpen: boolean;
  isReadOnly: boolean;
  isTeams: boolean;
  onConfigure: () => void;
}

export function TopFrame(props: ITopFrameProps) {

  const ref = React.useRef(null);
  const [content, setContent] = React.useState(null);

  const enablePropsChanged = React.useRef(false);

  const [propsChanged, setPropsChanged] = React.useState(0);

  React.useEffect(() => {
    if (enablePropsChanged.current) {
      const timer = setTimeout(() => setPropsChanged(propsChanged + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [
    props.height, props.width,
    props.zoom, props.startPage,
    props.hideToolbars, props.hideBorders, props.hideDiagramBoundary,
    props.disablePan, props.disableZoom, props.disablePanZoomWindow, props.disableHyperlinks
  ]);

  React.useEffect(() => {

    if (content) {
      const root: HTMLElement = ref.current;

      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/xml');

      const viewBox = doc.documentElement.getAttribute('viewBox');
      doc.documentElement.removeAttribute('viewBox');
      doc.documentElement.removeAttribute('width');
      doc.documentElement.removeAttribute('height');

      root.innerHTML = doc.documentElement.outerHTML;

      const tools = new PanZoom(root, { viewBox });

      return () => {
        root.innerHTML = '';
      };
    } else {
      enablePropsChanged.current = true;
    }

  }, [content, propsChanged]);

  const [loadError, setLoadError] = React.useState('');

  React.useEffect(() => {
    // props.context.statusRenderer.displayLoadingIndicator(ref.current, 'diagram');
    sp.web.getFileByUrl(props.url).getText().then(text => {
      setContent(text);
    });
  }, [props.url]);

  const rootStyle = {
    height: props.height,
    width: props.width,
    overflow: 'hidden'
  };

  const showPlaceholder = !props.url || loadError;

  const placeholderIconName = loadError
    ? "Error"
    : "Edit";

  const placeholderIconText = loadError
    ? "Unable to show this diagram"
    : "The diagram not selected";

  const placeholderDescription = props.isPropertyPaneOpen
    ? `Please click 'Browse...' Button on configuration panel to select the diagram.`
    : props.isReadOnly
      ? (props.isTeams
        ? `Please click 'Settings' menu on the Tab to reconfigure this web part.`
        : `Please click 'Edit' to start page editing to reconfigure this web part.`
        )
      : `Click 'Configure' button to reconfigure this web part.`;

  return (
    <ThemeProvider style={rootStyle} ref={ref}>
      {loadError && <MessageBar messageBarType={MessageBarType.error}>{loadError}</MessageBar>}
      {showPlaceholder && <Placeholder
        iconName={placeholderIconName}
        iconText={placeholderIconText}
        description={placeholderDescription}
        buttonLabel={"Configure"}
        onConfigure={() => props.onConfigure()}
        hideButton={props.isReadOnly}
        disableButton={props.isPropertyPaneOpen}
      />}
    </ThemeProvider>
  );
}
