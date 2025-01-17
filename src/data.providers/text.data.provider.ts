import {window} from 'vscode';
import * as fs from 'fs';
import * as config from '../config';
import * as fileUtils from '../utils/file.utils';
import {Logger, LogLevel} from '../logger';
import {IDataProvider} from '../data.manager';

/**
 * Text data provider.
 */
export class TextDataProvider implements IDataProvider {

  // TODO: add mime types later for http data loading
  // TODO: consider implementing separate data provider for each config/json data file type
  public supportedDataFileTypes: Array<string> = ['.csv', '.tsv', '.txt', '.tab'];

  private logger: Logger = new Logger('text.data.provider:', config.logLevel);

  /**
   * Creates new text data provider for .json, .json5 and .hjson data files.
   */
  constructor() {
    this.logger.debug('created for:', this.supportedDataFileTypes);
  }

  /**
   * Gets local or remote data.
   * @param dataUrl Local data file path or remote data url.
   * @param parseOptions Data parse options.
   * @param loadData Load data callback.
   */
  public async getData(dataUrl: string, parseOptions: any, loadData: Function): Promise<void> {
    let data: string = '';
    try {
      // TODO: change this to streaming text data read later
      data = String(await fileUtils.readDataFile(dataUrl, 'utf8')); // file encoding to read data as string
    }
    catch (error) {
      this.logger.logMessage(LogLevel.Error, `getData(): Error parsing '${dataUrl}' \n\t Error:`, error.message);
      window.showErrorMessage(`Unable to parse data file: '${dataUrl}'. \n\t Error: ${error.message}`);
    }
    loadData(data);
  }

  /**
   * Gets data table names for data sources with multiple data sets.
   * @param dataUrl Local data file path or remote data url.
   */
  public getDataTableNames(dataUrl: string): Array<string> {
    return []; // none for text data files
  }

  /**
   * Gets data schema in json format for file types that provide it.
   * @param dataUrl Local data file path or remote data url.
   */
  public getDataSchema(dataUrl: string): any {
    // TODO: return headers row for text data ???
    return null; // none for text data files
  }

  /**
   * Saves CSV data.
   * @param filePath Local data file path.
   * @param fileData Raw data to save.
   * @param tableName Table name for data files with multiple tables support.
   * @param showData Show saved data callback.
   */
  public saveData(filePath: string, fileData: any, tableName: string, showData?: Function): void {
    // save CSV data string
    if ( fileData.length > 0) {
      // TODO: change this to async later
      fs.writeFile(filePath, fileData, (error) => showData(error));
    }
  }
}
