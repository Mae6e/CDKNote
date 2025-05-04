import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { TABLE_NAME } from '../lambda/types/types';

export class CdkNoteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //! Create DynamoDB table
    const notesTable = new dynamodb.Table(this, 'NotesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: TABLE_NAME
    });

    //! Create Lambda function
    const notesLambda = new lambda.Function(this, 'NotesFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: notesTable.tableName,
      },
    });

    //! Grant Lambda permissions to access DynamoDB
    notesTable.grantReadWriteData(notesLambda);

    const api = new apigateway.LambdaRestApi(this, 'NotesApi', {
      handler: notesLambda,
      proxy: false
    });
    const integration = new apigateway.LambdaIntegration(notesLambda);

    //! Define the routes
    const noteResource = api.root.addResource('notes');
    noteResource.addMethod('POST', integration);
    noteResource.addMethod('GET', integration);

    const noteByIdResource = noteResource.addResource('{id}');
    noteByIdResource.addMethod('GET', integration);
    noteByIdResource.addMethod('DELETE', integration);
    noteByIdResource.addMethod('PUT', integration);

  }
}
