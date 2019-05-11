import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-core";
import { ERROR_TYPE } from "../constants/error";
import Folder from "../models/folder";
import { QueryResult } from "pg";

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

  public findByUserId = async (_, {user_id}) => {
    this.validateId(user_id);
  
    const f = new Folder({user_id});

    let err: Object | null = null;
    let folderData: QueryResult | null = null; 
    try {
      folderData = await f.findBy("user_id = $1", [user_id]);
    } catch({stack}) {
      err = f.checkErrorMessage(stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);

    const folders = folderData && folderData.rows;

    return folders;
  }

  public create = async (_, {name, user_id}) => {
    this.validateId(user_id);
    this.validation(name);

    const f = new Folder({name, user_id, created_at: new Date()});

    let folderData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      folderData = await f.create(true);
    } catch({stack}) {
      err = f.checkErrorMessage(stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(f.getTableData(), folderData)
    
    const folder = folderData && folderData.rows[0];

    return folder;
  }
}