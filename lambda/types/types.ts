
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ApiHandler } from "../api/api";

type DBClient = DynamoDBClient;
type App = { ApiHandler: ApiHandler }

type Response = { body: string, statusCode: number };
type Note = { id: string, content: string, state: number, updatedAt: Date };

const TABLE_NAME = 'notesTable';

export { App, DBClient, Response, Note, TABLE_NAME };