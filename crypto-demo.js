const crypto = require('crypto');

let salt = "123"
let pass = "qwerty"

//digest is output of hash function
//sha256 has a digest of 256 bits

let users = {};

function hash_func(password) {
    // Anything crypto related is asynchronous, so we will use a Promise
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {

            if (err) reject(err);

            resolve(derivedKey.toString("hex"));
        });
    })
}

// This will simulate the signup.
let user = "admin0";

hash_func(pass)
.then(hash => {
    users[user] = hash;
})
.then(() => {
    console.log(users);
})
.catch(err => console.log(err));


// Now, let's login
hash_func("qwerty")
.then(hash => {
    if(hash == users["admin0"]) {
        console.log('authenticated!');
    } else {
        console.log('not authenticated');
    }
})

// The then would be run in the event of the resolve. It takes a callback function










// const crypto = require('crypto');

// let salt = "123"
// let pass = "qwerty"
// let usr = "admin0"
// let users = {}

// function hashing(password) {
  
//   return new Promise((resolve, reject) => {
//     crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {

//       if (err) reject(err);
  
//       resolve(derivedKey.toString("hex"))
//     });
//   })
// }

// hashing(pass)
// .then(hash => {
//   users[usr] = hash
// })
// .catch(err => console.log(err))

// let pass2 = "qwerty"
// let usr2 = "admin1"
// hashing(pass2)
// .then(hash => {
//   users[usr2] = hash
// })
// .then(() => {
//   console.log(users)
// })
// .then(() => {
//   if (users[usr] == users[usr2]) console.log("same password")
//   else console.log("not equal")
// })
// .catch(err => console.log(err))

