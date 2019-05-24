import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-core";
import { ERROR_TYPE } from "../constants/error";
import Folder from "../models/folder";
import { QueryResult } from "pg";
import PostsFolders from "../models/posts_folders";

export default class FoldersHandler extends AppHandler {
  private validation(name: string) {
    if(this.checkEmptyString(name)) {
      throw new UserInputError("Folder name can not empty", {
        key: "name",
        value: name,
        type: ERROR_TYPE.Empty
      });
    }
  }

  public findByUserId = async (_, {user_id, page}) => {
    this.validateId(user_id);
  
    const f = new Folder();

    const tableData = {user_id};

    let err: Object | null = null;
    let folderData: QueryResult | null = null; 
    try {
      const limit = page !== 0 ? page * 20 : 20;
      const offset = page > 1 ? (page - 1) * 20 : 0;
      folderData = await f.findBy("user_id = $1", [user_id], {type: "DESC", column: "created_at"}, limit, offset);
    } catch({stack}) {
      err = f.checkErrorMessage({...tableData, page}, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);

    const folders = folderData && folderData.rows;

    return folders;
  }

  public create = async (_, {name, user_id}) => {
    this.validateId(user_id);
    this.validation(name);

    const f = new Folder();

    const tableData = {name, user_id, created_at: new Date()};

    let folderData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      folderData = await f.create(tableData, true);
    } catch({stack}) {
      err = f.checkErrorMessage(tableData, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(tableData, folderData)
    
    const folder = folderData && folderData.rows[0];

    return folder;
  }

  public save = async (_, {post_id, folder_id}) => {
    this.validateId(post_id);
    this.validateId(folder_id);

    const pf = new PostsFolders();

    const tableData = {post_id, folder_id, created_at: new Date()};

    let folderData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      folderData = await pf.saveToFolder(tableData);
    } catch({stack}) {
      err = pf.checkErrorMessage(tableData, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(tableData, folderData);

    const posts_folders = folderData && folderData.rows[0];

    return posts_folders;
  }

  public changeFolder = async (_, {post_folder_id, destination_folder_id}) => {
    this.validateId(post_folder_id);
    this.validateId(destination_folder_id);

    const pf = new PostsFolders();

    const tableData = {id: post_folder_id, folder_id: destination_folder_id};

    let response: QueryResult | null = null;
    let err: Object | null = null;
    try {
      response = await pf.update(tableData);
    } catch({stack}) {
      err = pf.checkErrorMessage(tableData, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(tableData, response);

    // The return value is true because it is validated by this.validateResponse function
    return true;
  }
}
