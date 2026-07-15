/*==================================================
LUNOVIA FIREBASE SERVICE
Version 1.0
==================================================*/

"use strict";

/*==================================================
FIREBASE CONFIGURATION
==================================================*/

const firebaseConfig={

apiKey:"",

authDomain:"",

projectId:"",

storageBucket:"",

messagingSenderId:"",

appId:""

};

/*==================================================
GLOBAL SERVICES
==================================================*/

let firebaseApp=null;

let firebaseAuth=null;

let firestoreDB=null;

let firebaseStorage=null;

/*==================================================
INITIALIZE
==================================================*/

async function initializeFirebase(){

try{

firebaseApp=

firebase.initializeApp(

firebaseConfig

);

firebaseAuth=

firebase.auth();

firestoreDB=

firebase.firestore();

firebaseStorage=

firebase.storage();

console.log(

"LUNOVIA Firebase Ready"

);

}catch(error){

console.error(

error

);

}

}

/*==================================================
START
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeFirebase

);
