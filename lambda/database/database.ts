import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DBClient } from '../types/types';

const newDynamoDBClient : DBClient = new DynamoDBClient({
  region: "ap-southeast-2"
});

export { newDynamoDBClient  };