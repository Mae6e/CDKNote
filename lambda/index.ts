
import { newApp } from './app/app';
import { Response } from './types/types';

export const handler = async (event: any): Promise<Response> => {
  try {
    const app = newApp();
    const body = JSON.parse(event.body);
    const path: string = event.path;
    const method = event.httpMethod;
    const id = event.pathParameters?.id;

    if (path.indexOf('/notes') === -1) return notFoundResponse(path);

    if (method === 'POST') {
      return await app.ApiHandler.createNote(body);
    }
    else if (method === 'GET') {
      if (id) return await app.ApiHandler.getNoteById(id);
      else return await app.ApiHandler.getAllNotes();
    }
    else if (method === 'PUT') {
      return await app.ApiHandler.updateNoteById(id, body);
    }
    else if (method === 'DELETE') {
      return await app.ApiHandler.deleteNoteById(id);
    }
    else {
      return notFoundResponse(path);
    }

  } catch (error: any) {
    return errorResponse(error);
  }
};



//? Defined response for use in handler  
const notFoundResponse = (path: string): Response => {
  return {
    statusCode: 404,
    body: JSON.stringify({ message: `not found ${path}` }),
  };
}
const errorResponse = (error: Error): Response => {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: error.message })
  };
}