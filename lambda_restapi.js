const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();
     
exports.handler = async (event) => {
        
    //      console.log("Hello world.get ...")
    //   console.log(event.httpMethod)
    //   //  console.log(event.body)
    //    console.log(event.pathParameters.id)
      
      //let requestJSON = JSON.parse(event)
      
      let resource = event.httpMethod + " " +event.resource
      console.log(resource)
      
      try {
    switch (resource) {
      case "DELETE /items/{id}":
        await dynamo
          .delete({
            TableName: "congaiyeucuaba",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /items/{id}":
        body = await dynamo
          .get({
            TableName: "congaiyeucuaba",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        break;
      case "GET /items":
        body = await dynamo.scan({ TableName: "congaiyeucuaba" }).promise();
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "congaiyeucuaba",
            Item: {
              id: requestJSON.id,
              price: requestJSON.price,
              name: requestJSON.name
            }
          })
          .promise();
        body = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }
     
        
    //   console.log(JSON.stringify(event))
       
      
       
      return {
          statusCode: 200,
            headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
        },
         body: body
      }
};

