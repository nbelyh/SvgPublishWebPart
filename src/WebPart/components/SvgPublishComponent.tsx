import * as React from 'react';
import { SvgPublishContext, LinkClickedEvent, SelectionChangedEvent, ViewChangedEvent } from 'svgpublish';
import { IDiagramInfo } from 'svgpublish/dist/interfaces/IDiagramInfo';
import { IServices } from 'svgpublish/dist/interfaces/IServices';

export interface ISvgPublishComponentProps {
  url: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;

  enableZoom?: boolean;
  enablePan?: boolean;
  enableZoomShift?: boolean;
  enableZoomCtrl?: boolean;
  twoFingersTouch?: boolean;

  enableLinks?: boolean;
  enableFollowHyperlinks?: boolean;
  openHyperlinksInNewWindow?: boolean;

  enableSelection?: boolean;
  enableHover?: boolean;

  enableBlur?: boolean;
  blur?: number;
  enableDilate?: boolean;
  dilate?: number;
  selectionMode?: 'normal' | 'lighten' | 'darken';
  selectColor?: string;
  hoverColor?: string;
  hyperlinkColor?: string;
  enableBoxSelection?: boolean;

  selectedShapeId?: string;

  onLinkClicked?: (evt: LinkClickedEvent) => void | null;
  onSelectionChanged?: (evt: SelectionChangedEvent) => void;
  onViewChanged?: (evt: ViewChangedEvent) => void;
}

export function SvgPublishComponent(props: ISvgPublishComponentProps) {

  const containerRef = React.useRef(null);
  const [context, setContext] = React.useState<SvgPublishContext | null>(null);

  const getContent = React.useCallback(async (url: string) => {
    const response = await fetch(url);
    const content = await response.text();
    return content;
  }, []);

  const mergeProps = React.useCallback((src: IDiagramInfo, p: ISvgPublishComponentProps) => {
    const result: IDiagramInfo = {
      ...src,
      enableZoom: p.enableZoom,
      enablePan: p.enablePan,
      enableZoomShift: p.enableZoomShift,
      enableZoomCtrl: p.enableZoomCtrl,

      enableFollowHyperlinks: p.enableFollowHyperlinks,

      enableSelection: p.enableSelection,
      enableHover: p.enableHover,
      twoFingersTouch: p.twoFingersTouch,
      openHyperlinksInNewWindow: p.openHyperlinksInNewWindow,
      selectionView: {
        ...src.selectionView,
        mode: p.selectionMode,
        selectColor: p.selectColor,
        hoverColor: p.hoverColor,
        hyperlinkColor: p.hyperlinkColor,
        enableBoxSelection: p.enableBoxSelection,
        enableBlur: p.enableBlur,
        blur: p.blur,
        dilate: p.dilate,
        enableDilate: p.enableDilate,
      }
    };
    return result;
  }, []);

  React.useEffect(() => {
    if (context && props.onLinkClicked) {
      const onLinkClicked = (evt: Event) => props.onLinkClicked!(evt as LinkClickedEvent);
      context.events.addEventListener('linkClicked', onLinkClicked);
      return () => context.events.removeEventListener('linkClicked', onLinkClicked);
    }
  }, [context, props.onLinkClicked]);

  React.useEffect(() => {
    if (context && props.onSelectionChanged) {
      const onSelectionChanged = (evt: Event) => props.onSelectionChanged!(evt as SelectionChangedEvent);
      context.events.addEventListener('selectionChanged', onSelectionChanged);
      return () => context.events.removeEventListener('selectionChanged', onSelectionChanged);
    }
  }, [context, props.onSelectionChanged]);

  React.useEffect(() => {
    if (context && props.onViewChanged) {
      const onViewChanged = (evt: Event) => props.onViewChanged!(evt as ViewChangedEvent);
      context.events.addEventListener('viewChanged', onViewChanged);
      return () => context.events.removeEventListener('viewChanged', onViewChanged);
    }
  }, [context, props.onViewChanged]);

  React.useEffect(() => {

    if (props.url) {
      getContent(props.url).then(content => {
        if (containerRef.current) {

          const init = mergeProps({} as any, props);

          const newContext = new SvgPublishContext(containerRef.current, content, init);
          if (newContext?.services?.selection && props.selectedShapeId) {
            newContext.services.selection.setSelection(props.selectedShapeId);
          }
          setContext(newContext);
        }
      }, err => {
        console.error(err);
      })
    }

    return () => {
      if (context) {
        context.destroy();
        setContext(null);
      }
    };

  }, [props.url]);

  const enableService = (name: keyof IServices, enable?: boolean) => {
    if (context) {
      const service = context.services?.[name];
      if (service) {
        service.reset();
        if (!enable) {
          context.enableService(name, false);
        }
      } else {
        if (enable) {
          context.enableService(name, true);
        }
      }
    }
  }

  React.useEffect(() => {
    if (context?.diagram) {
      context.diagram.enablePan = !!props.enablePan;
    }
  }, [context, props.enablePan]);

  React.useEffect(() => {
    if (context?.diagram) {
      context.diagram.enableZoom = !!props.enableZoom;
    }
  }, [context, props.enableZoom]);

  React.useEffect(() => {
    context?.services?.view?.reset()
  }, [context, props.width, props.height]);

  React.useEffect(() => {
    if (context?.diagram) {
      context.diagram = mergeProps(context.diagram, props);
    }
    enableService('selection', props.enableSelection);
    enableService('hover', props.enableHover);
    enableService('links', props.enableFollowHyperlinks);
  }, [
    context,
    props.enableSelection,
    props.enableHover,
    props.enableBlur,
    props.blur,
    props.enableDilate,
    props.dilate,
    props.selectionMode,
    props.selectColor,
    props.hoverColor,
    props.hyperlinkColor,
    props.enableBoxSelection,
    props.openHyperlinksInNewWindow,
    props.twoFingersTouch,
    props.enableFollowHyperlinks,
    props.enableZoomShift,
    props.enableZoomCtrl,
  ]);

  React.useEffect(() => {
    if (context?.services?.selection) {
      if (props.selectedShapeId) {
        context.services.selection.setSelection(props.selectedShapeId);
      } else {
        context.services.selection.clearSelection();
      }
    }
  }, [context, props.selectedShapeId]);

  const style: React.CSSProperties = {
    ...props.style,
    width: props.width ?? '100%',
    height: props.height ?? '100%',
    overflow: 'hidden',
  };

  return (
    <div style={style} ref={containerRef} />
  );
}
