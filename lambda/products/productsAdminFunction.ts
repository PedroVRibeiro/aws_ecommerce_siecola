import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  const lambdaRequestId = context.awsRequestId
  const apiGatewayRequestId = event.requestContext.requestId

  console.log(`API Gateway RequestId: ${apiGatewayRequestId}`)
  console.log(`Lambda RequestId: ${lambdaRequestId}`)

  const method = event.httpMethod
  if (event.resource === "/products") {
      console.log('POST - /products - method received')

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "POST - /products - OK"
        })
    }
  } else if (event.resource === "products/{id}") {
    const productId = event.pathParameters!.id as string
    if (method === "PUT") {
      console.log(`PUT - /products/${productId} - method received`)

      return {
        statusCode: 200,
        body: `PUT - /products/${productId} - OK`
      }
    } else if (method === "DELETE") {
      console.log(`DELETE - /products/${productId} - method received`)

      return {
        statusCode: 200,
        body: `DELETE - /products/${productId} - OK`
      }
    }
    
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad Request"
    })
  }
}