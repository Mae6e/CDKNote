import {
  PutItemCommand, ScanCommand, GetItemCommand, DeleteItemCommand,
  DeleteItemCommandInput, PutItemCommandInput, ScanCommandInput,
  UpdateItemCommand, UpdateItemCommandInput, GetItemCommandInput
} from '@aws-sdk/client-dynamodb';
import { DBClient, TABLE_NAME as TableName, Response, Note } from '../types/types';

export class ApiHandler {
  private dbStore: DBClient;

  constructor(dbStore: DBClient) {
    this.dbStore = dbStore;
  }

  //* Create Note
  public async createNote(note: Partial<Note>): Promise<Response> {
    const { state, content } = note;
    if (!content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'the note content is required.' })
      };
    }
    if (!state && typeof state !== 'number') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'please enter a valid state.' })
      };
    }

    const id = Date.now().toString();
    const now = new Date().toISOString();
    const params: PutItemCommandInput = {
      TableName,
      Item: {
        id: { S: id },
        content: { S: content },
        state: { N: state.toString() },
        updatedAt: { S: now },
      },
    };
    await this.dbStore.send(new PutItemCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'created note successfully.', data: {
          id: params.Item?.id.S,
          content: params.Item?.content.S,
          state: params.Item?.state.N,
          updatedAt: params.Item?.updatedAt.S,
        }
      })
    };
  }

  //* Get All Notes
  public async getAllNotes(): Promise<Response> {
    const params: ScanCommandInput = {
      TableName
    };
    const data = await this.dbStore.send(new ScanCommand(params));
    const notes = data.Items?.map((item) => ({
      id: item.id.S,
      content: item.content.S,
      state: item.state.N,
      updatedAt: item.updatedAt.S,
    })) || [];

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'notes find successfully.', results: notes.length, data: notes }),
    };
  }

  //* Get Note By ID
  public async getNoteById(id: string): Promise<Response> {
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'the note id is required.' }),
      };
    }

    const params: GetItemCommandInput = {
      TableName,
      Key: {
        id: { S: id },
      },
    };
    const data = await this.dbStore.send(new GetItemCommand(params));
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'note not found.' }),
      };
    }

    const note = {
      id: data.Item.id.S,
      content: data.Item.content.S,
      state: data.Item.state.N,
      updatedAt: data.Item.updatedAt.S,
    };
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'note find successfully.', data: note }),
    };
  }

  //* Update Note By ID
  public async updateNoteById(id: string, note: Partial<Note>): Promise<Response> {

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'the note id is required.' }),
      };
    }
    const { state, content } = note;

    if (!content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'the note content is required.' }),
      };
    }
    if (!state && typeof state !== 'number') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'please enter a valid state.' })
      };
    }

    const now = new Date().toISOString();
    const params: UpdateItemCommandInput = {
      TableName,
      Key: {
        id: { S: id },
      },
      UpdateExpression: 'SET content = :c, #s = :s, updatedAt = :u',
      ExpressionAttributeNames: {
        '#s': 'state',
      },
      ExpressionAttributeValues: {
        ':c': { S: content },
        ':s': { N: state.toString() },
        ':u': { S: now },
      },
      ConditionExpression: 'attribute_exists(id)',
      ReturnValues: 'ALL_NEW',
    };
    try {
      const data = await this.dbStore.send(new UpdateItemCommand(params));
      if (!data.Attributes) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'note not found.' }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'note updated successfully.',
          data: {
            id: data.Attributes.id.S,
            content: data.Attributes.content.S,
            state: data.Attributes.state.N,
            updatedAt: data.Attributes.updatedAt.S,
          },
        }),
      };
    }
    catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'note not found.' }),
        };
      }
      throw error;
    }
  }

  //* Delete Note By ID
  public async deleteNoteById(id: string): Promise<Response> {
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'the note id is required.' }),
      };
    }

    const params: DeleteItemCommandInput = {
      TableName,
      Key: {
        id: { S: id },
      },
      ReturnValues: 'ALL_OLD'
    };

    const data = await this.dbStore.send(new DeleteItemCommand(params));
    if (!data.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'note not found.' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'note deleted successfully.' }),
    };
  }

}
