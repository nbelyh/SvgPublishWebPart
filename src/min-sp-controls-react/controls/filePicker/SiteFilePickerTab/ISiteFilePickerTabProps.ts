import { IFilePickerTab } from "../FilePicker.types";
import { FileBrowserService } from "../../../services/FileBrowserService";
import { IBreadcrumbItem } from "@fluentui/react/lib/Breadcrumb";

export interface ISiteFilePickerTabProps extends IFilePickerTab {
  fileBrowserService: FileBrowserService;

  /**
   * Represents the base node in the breadrumb navigation
   */
  breadcrumbFirstNode?: IBreadcrumbItem;

  /**
   * Specifies a default folder to be active in the Site Files tab
   */
  defaultFolderAbsolutePath?: string;

  includePageLibraries?: boolean;
}
