import { newDynamoDBClient } from '../database/database';
import { ApiHandler } from '../api/api';
import { App } from '../types/types';

const newApp = () : App => {
  //? Initialise the db store
  //? gets passeed the API handler
  const apiHandler = new ApiHandler(newDynamoDBClient);
  return {
    ApiHandler: apiHandler,
  };
};

export { newApp };
