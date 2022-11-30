declare interface IWebPartStrings {
  FieldSvgFile: string;
  FieldSvgFileBrowse: string;
  BasicGroupName: string;
  FieldWidth: string;
  FieldHeight: string;
  View: string;
}

declare module 'WebPartStrings' {
  const strings: IWebPartStrings;
  export = strings;
}
