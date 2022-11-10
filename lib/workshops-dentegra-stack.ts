import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as apigw from 'aws-cdk-lib/aws-apigateway'

import { join } from 'path';
import { CfnOutput } from 'aws-cdk-lib';

export class WorkshopsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'test-table-1', {
      tableName: 'technogi-ws-table-1',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.NUMBER
      },
      sortKey: {
        name: 'order',
        type: dynamodb.AttributeType.NUMBER
      }
    })

    const lambda = new nodejs.NodejsFunction(this, 'test-lambda-1', {
      functionName: 'technogi-workshop-lambda-1',
      entry: join(__dirname, 'app', 'lambda.ts'),
      environment: {
        ENV1: 'Workshop 10 nov',
        TABLE_NAME: table.tableName
      },
    })

    table.grantReadWriteData(lambda)

    const api = new apigw.RestApi(this, 'test-ag', {
      restApiName: 'technogi-workshop-api'
    })


    api.root.addMethod('GET', new apigw.LambdaIntegration(lambda))

    new CfnOutput(this, 'endpoint', {
      value: api.url
    })
  }
}
