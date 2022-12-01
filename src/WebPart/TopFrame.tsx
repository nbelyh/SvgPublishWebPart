import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartProps } from "./IWebPartProps";
import { Placeholder } from 'min-sp-controls-react/controls/placeholder';
import { MessageBar, MessageBarType, ThemeProvider } from '@fluentui/react';
import { sp } from '@pnp/sp';
import { LinkClickedEvent, SvgPublishContext } from 'svgpublish';
import { Errors } from './Errors';

export function TopFrame(props: {
  context: WebPartContext;
  webpart: IWebPartProps;
  isPropertyPaneOpen: boolean;
  isReadOnly: boolean;
  isTeams: boolean;
  onConfigure: () => void;
}) {

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
    props.webpart.enablePan, props.webpart.enableZoom, props.webpart.enableHyperlinks
  ]);

  const contextRef = React.useRef(null);

  React.useEffect(() => {

    if (content) {
      const container: HTMLElement = ref.current;

      contextRef.current = SvgPublishContext.create(container, content);

      contextRef.current.events.addEventListener('linkClicked', (evt: LinkClickedEvent) => {

        evt.preventDefault();

        const link = evt.args.link;
        const pageId = link.PageId;
        if (pageId >= 0) {
          const diagram = evt.args.context.diagram;
          const page = diagram.pages.find(p => p.Id === pageId);
          const pageUrl = url.substring(0, url.lastIndexOf('/') + 1) + page.FileName;
          setUrl(pageUrl);
        } else {
          if (link.Address) {
            window.open(link.Address, '_blank');
          }
        }
      })

      return () => {
        if (contextRef.current) {
          SvgPublishContext.destroy(contextRef.current);
          contextRef.current = null;
        }
      };
    } else {
      enablePropsChanged.current = true;
    }

  }, [content, propsChanged]);

  const [loadError, setLoadError] = React.useState('');

  React.useEffect(() => {
    if (url) {
      sp.web.getFileByUrl(url).getText().then(content => {
        setLoadError('');
        setContent(content);
      }, err => {
        Errors.formatErrorMessage(err).then(message => {
          setLoadError(`Unable to get file ${url}: ${message}`)
        });
      });
    }
  }, [url]);

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

  const rootStyle: React.CSSProperties = {
    height: props.webpart.height,
    width: props.webpart.width,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const divStyle = {
    flexGrow: 1
  };

  return (
    <ThemeProvider style={rootStyle}>
      {loadError && <MessageBar messageBarType={MessageBarType.warning}>{loadError}</MessageBar>}
      {showPlaceholder && <Placeholder
        iconName={placeholderIconName}
        iconText={placeholderIconText}
        description={placeholderDescription}
        buttonLabel={"Configure"}
        onConfigure={onConfigure}
        hideButton={props.isReadOnly}
        disableButton={props.isPropertyPaneOpen}
      />}
      <div style={divStyle} ref={ref} />
    </ThemeProvider>
  );
}
