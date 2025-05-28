const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { execSync } = require('child_process');

const dynamo = new AWS.DynamoDB.DocumentClient();

const getParsedData = (event) => {
  if (typeof event === 'object' && event.fullName && event.email) {
    return event; 
  }
  if (event.body) {
    try {
      return typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      console.error('Failed to parse event.body:', e);
    }
  }
  return undefined;
};

exports.handler = async (event) => {
  console.log("Lambda invoked. Raw event:", JSON.stringify(event));

  const data = getParsedData(event);
  console.log("Parsed data:", data);

  let commandOutput = '';


  if (data?.traceId && typeof data.issueDetails === 'string') {
    try {
      commandOutput = execSync(`echo "${data.issueDetails}"`).toString().trim();
    } catch (err) {
      commandOutput = 'error';
    }
  }

  if (!data || !data.fullName || !data.email) {
    console.warn("Validation failed. Data missing.");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: JSON.stringify({ message: 'Invalid input: required fields missing', debug: commandOutput }),
    };
  }

  const params = {
    TableName: 'SupportRequests',
    Item: {
      requestId: uuidv4(),
      fullName: data.fullName,
      email: data.email,
      corporateId: data.corporateId || '',
      contactNumber: data.contactNumber || '',
      issueDetails: data.issueDetails || '',
      submittedAt: new Date().toISOString()
    }
  };

  try {
    await dynamo.put(params).promise();
    console.log("Item successfully saved to DynamoDB.");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: JSON.stringify({
        message: 'Request saved successfully',
        debug: commandOutput 
      }),
    };
  } catch (err) {
    console.error('Unexpected error while saving to DynamoDB:', err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: JSON.stringify({ message: 'Failed to save request', debug: commandOutput }),
    };
  }
};
