// Pretend you're the server, receiving the string below as the authorization header.
// Decode to plain text to get username and password


const authHeader = "Basic YWRtaW4wOnBhc3Nub25l";

// What is buffer? And why do we need to put it into a buffer?
// Buffer is an array of bites denoted by their hexidecimal value. 
let buff = Buffer.from(authHeader, 'base64');

const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

const user = auth[0];
const password = auth[1];

