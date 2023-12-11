import * as cdk from "aws-cdk-lib"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as ssm from "aws-cdk-lib/aws-ssm"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as lambda from "aws-cdk-lib/aws-lambda"
import { Construct } from 'constructs'

interface OrdersAppStackProps extends cdk.StackProps {
  productsDdb: dynamodb.Table
}

export class OrdersAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: OrdersAppStackProps) {
    super(scope, id, props)

    const orderDdb = new dynamodb.Table(this, "OrdersDdb", {
      tableName: "orders",
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1
    })

    //Orders Layer
    const ordersLayerArn = ssm.StringParameter.valueForStringParameter(this, "OrdersLayerVersionArn")
    const ordersLayer = lambda.LayerVersion.fromLayerVersionArn(this, "OrdersLayerVersionArn", ordersLayerArn)

    //Products Layer
    const productsLayerArn = ssm.StringParameter.valueForStringParameter(this, "ProductsLayerVersionArn")
    const productsLayer = lambda.LayerVersion.fromLayerVersionArn(this, "ProductsLayerVersionArn", productsLayerArn)
  }
}