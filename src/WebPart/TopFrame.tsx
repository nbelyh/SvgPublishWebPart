import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from './WebPart';
import { Placeholder } from '../min-sp-controls-react/controls/placeholder';
import { hiddenContentStyle, MessageBar, MessageBarType, ThemeProvider } from '@fluentui/react';
import { sp } from '@pnp/sp';
import { SvgPublish, LinkClickedEvent } from 'svgpublish';

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
    setUrl(props.webpart.url);
  }, [props.webpart.url])

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
      const container: HTMLElement = ref.current;

      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/xml');

      const diagramNode = doc.documentElement.getElementsByTagNameNS("http://vispublish", "SvgPublishData")[0];
      const diagram = diagramNode && JSON.parse(diagramNode.innerHTML);

      const viewBox = diagram.viewBox || doc.documentElement.getAttribute('viewBox');
      doc.documentElement.removeAttribute('viewBox');
      doc.documentElement.setAttribute('width', '100%');
      doc.documentElement.setAttribute('height', '100%');

      container.innerHTML = doc.documentElement.outerHTML;
      const svg = container.querySelector('svg');

      const context = {
        svg,
        container,
        diagram,
        events: new EventTarget
      };

      const component = new SvgPublish(context, viewBox);

      context.events.addEventListener('linkClicked', (evt: LinkClickedEvent) => {
        evt.preventDefault();
        setUrl(evt.args.href);
      })

      return () => {
        container.innerHTML = '';
      };
    } else {
      enablePropsChanged.current = true;
    }

  }, [content, propsChanged]);

  const [loadError, setLoadError] = React.useState('');

  React.useEffect(() => {
    if (url) {
      sp.web.getFileByUrl(url).getText().then(content => {
        setContent(content);
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
    ? "Unable to show the diagram"
    : "The diagram is not selected";

  const placeholderDescription = props.isPropertyPaneOpen
    ? `Please click 'Browse...' Button on configuration panel to select the diagram.`
    : props.isReadOnly
      ? (props.isTeams
        ? `Please click 'Settings' menu on the Tab to reconfigure this web part.`
        : `Please click 'Edit' to start page editing to reconfigure this web part.`
      )
      : `Click 'Configure' button to reconfigure this web part.`;

  const onConfigure = () => {
    props.onConfigure();
  }

  return (
    <ThemeProvider style={rootStyle}>
      {showPlaceholder && <Placeholder
        iconName={placeholderIconName}
        iconText={placeholderIconText}
        description={placeholderDescription}
        buttonLabel={"Configure"}
        onConfigure={onConfigure}
        hideButton={props.isReadOnly}
        disableButton={props.isPropertyPaneOpen}
      />}
      <div style={{ width: '100%', height: '100%', display: showPlaceholder ? 'none' : 'block' }} ref={ref}></div>
    </ThemeProvider>
  );
}
