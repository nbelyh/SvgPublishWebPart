import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from './WebPart';
import { Placeholder } from '../min-sp-controls-react/controls/placeholder';
import { MessageBar, MessageBarType, ThemeProvider } from '@fluentui/react';
import { sp } from '@pnp/sp';
import { SvgPublish, VpSelection, VpLinks, LinkClickedEvent } from 'svgpublish';

interface ITopFrameProps {
  context: WebPartContext;
  webpart: IWebPartProps;
  isPropertyPaneOpen: boolean;
  isReadOnly: boolean;
  isTeams: boolean;
  onConfigure: () => void;
}

export function TopFrame(props: ITopFrameProps) {

  const ref = React.useRef(null);
  const [url, setUrl] = React.useState<string>(props.webpart.url);
  const [content, setContent] = React.useState(null);

  const enablePropsChanged = React.useRef(false);

  const [propsChanged, setPropsChanged] = React.useState(0);

  React.useEffect(() => {
    if (enablePropsChanged.current) {
      const timer = setTimeout(() => setPropsChanged(propsChanged + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [
    props.webpart.height, props.webpart.width,
    props.webpart.zoom, props.webpart.startPage,
    props.webpart.hideToolbars, props.webpart.hideBorders, props.webpart.hideDiagramBoundary,
    props.webpart.disablePan, props.webpart.disableZoom, props.webpart.disablePanZoomWindow, props.webpart.disableHyperlinks
  ]);

  React.useEffect(() => {

    if (content) {
      const root: HTMLElement = ref.current;

      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/xml');

      const viewBox = doc.documentElement.getAttribute('viewBox');
      doc.documentElement.removeAttribute('viewBox');
      doc.documentElement.setAttribute('width', '100%');
      doc.documentElement.setAttribute('height', '100%');

      root.innerHTML = doc.documentElement.outerHTML;
      const svg = root.querySelector('svg');

      const diagramNode = doc.documentElement.getElementsByTagNameNS("http://vispublish", "SvgPublishData")[0];
      const diagram = diagramNode && JSON.parse(diagramNode.innerHTML);

      const component = new SvgPublish(root, svg, diagram);
      const vpSelection = new VpSelection(component);
      const vpLinks = new VpLinks(component);

      component.diagram.events.addEventListener('linkClicked', (evt: LinkClickedEvent) => {
        setUrl(evt.args.href);
        return true;
      })

      return () => {
        root.innerHTML = '';
      };
    } else {
      enablePropsChanged.current = true;
    }

  }, [content, propsChanged]);

  const [loadError, setLoadError] = React.useState('');

  React.useEffect(() => {
    if (url) {
      sp.web.getFileByUrl(url).getText().then(text => {
        setContent(text);
      }, err => {
        setLoadError(`${err}`);
      });
    }
  }, [url]);

  const rootStyle = {
    height: props.webpart.height,
    width: props.webpart.width,
    overflow: 'hidden'
  };

  const showPlaceholder = !url || loadError;

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
