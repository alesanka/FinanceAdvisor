// import fetch from 'node-fetch';
// import * as dotenv from 'dotenv';
// import Request from '@node-oauth/oauth2-server';
// import Responce from '@node-oauth/oauth2-server';

// dotenv.config();
// const client = {
//   id: process.env.CLIENT_ID,
//   secret: process.env.CLIENT_SECRET,
// };

// // const rootUrl = 'http://localhost:5000';

// // const getBody = async (response) => {
// //   const body = await response.text();
// //   return body;
// // };
// // const request = async ({ url, method = 'get', body, headers }) => {
// //   const fullUrl = `${rootUrl}${url}`;
// //   const options = { method, body, headers };
// //   const response = await fetch(fullUrl, options);
// //   return getBody(response);
// // };

// export const run = async () => {
//   const tokenBodyParams = new URLSearchParams();
//   tokenBodyParams.append('grant_type', 'password');
//   tokenBodyParams.append('scope', 'write');

//   const body = await request({
//     url: '/token',
//     note: 'valid credentials',
//     method: 'post',
//     body: tokenBodyParams,
//     headers: {
//       'content-type': 'application/x-www-form-urlencoded',
//       authorization:
//         'Basic ' +
//         Buffer.from(`${client.id}:${client.secret}`).toString('base64'),
//     },
//   });

//   const token = JSON.parse(body);
//   const accessToken = token.access_token;
//   const tokenType = token.token_type;

//   if (accessToken && tokenType) {
//     console.log('authorization token successfully retrieved!');
//   }

//   // await request({
//   //   url: '/read-resource',
//   //   note: 'authenticated, resource is not yet defined',
//   //   headers: {
//   //     authorization: `${tokenType} ${accessToken}`,
//   //   },
//   // });

//   // await request({
//   //   url: '/write-resource',
//   //   method: 'post',
//   //   note: 'authentication failed',
//   //   body: JSON.stringify({ value: 'foo-bar-moo' }),
//   //   headers: {
//   //     'content-type': 'application/json',
//   //     authorization: `${tokenType} random-token-foo`,
//   //   },
//   // });

//   // await request({
//   //   url: '/write-resource',
//   //   method: 'post',
//   //   note: 'Invalid token',
//   //   body: JSON.stringify({ value: 'foo-bar-moo' }),
//   //   headers: {
//   //     'content-type': 'application/json',
//   //     authorization: `${tokenType} ${accessToken}`,
//   //   },
//   // });

//   // await request({
//   //   url: '/read-resource',
//   //   note: 'authenticated, resource is now',
//   //   headers: {
//   //     authorization: `${tokenType} ${accessToken}`,
//   //   },
//   // });
// };
