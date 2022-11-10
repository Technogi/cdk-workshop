import { APIGatewayProxyHandler } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { inspect } from 'util'

export const handler: APIGatewayProxyHandler = async (param, ctx) => {

  const TableName = process.env.TABLE_NAME || ''

  const client = new DocumentClient()

  await client.put({
    TableName,
    Item: {
      id: Date.now(),
      order: Math.floor(Math.random() * 1000),
      text: `Technogi test ${new Date()}`
    }
  }).promise()

  const result = await client.scan({
    TableName,
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${param.queryStringParameters?.q} ${process.env.ENV1}`,
      result: result?.Items || []
    })
  }
}
