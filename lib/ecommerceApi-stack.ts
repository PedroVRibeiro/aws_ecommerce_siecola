import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cdk from 'aws-cdk-lib';
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"
import { Construct } from 'constructs';

interface ECommerceApiStackProps extends cdk.StackProps {
  productsFetchHandler: lambdaNodeJS.NodejsFunction
  productsAdminHandler: lambdaNodeJS.NodejsFunction
}

export class ECommerceApiStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
    super(scope, id, props)

    // Não é necessário gerar logs do modo abaixo nos Lambdas, pois o cdk gera automaticamente
    const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs")
    const api = new apigateway.RestApi(this, "ECommerceApi", {
      restApiName: "ECommerceApi",
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          caller: true,
          user: true
        })
      }
    })

    // INTEGRAÇÃO FETCH
    const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)

    // GET "/products"
    const productsResource = api.root.addResource("products")
    productsResource.addMethod("GET", productsFetchIntegration)

    // GET "/products/{id}"
    const productsIdResource = productsResource.addResource("{id}")
    productsIdResource.addMethod("GET", productsFetchIntegration)

    // INTEGRAÇÃO ADMIN
    const productsAdminIntegration = new apigateway.LambdaIntegration(props.productsAdminHandler)

    // POST "/products"
    productsResource.addMethod("POST", productsAdminIntegration)

    // PUT "/products/{id}"
    productsIdResource.addMethod("PUT", productsAdminIntegration)

    // DELETE "/products/{id}"
    productsIdResource.addMethod("DELETE", productsAdminIntegration)

  }
}