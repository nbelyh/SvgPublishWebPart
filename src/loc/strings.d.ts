declare interface IWebPartStrings {
  FieldSvgFile: string;
  FieldSvgFileBrowse: string;
  FieldZoom: string;
  BasicGroupName: string;
  FieldWidth: string;
  FieldHeight: string;
  View: string;
  FieldStartPage: string;
}

declare module 'WebPartStrings' {
  const strings: IWebPartStrings;
  export = strings;
}
