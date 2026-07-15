/*==================================================
LUNOVIA COUPON MANAGER
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE
==================================================*/

const COUPONS_STORAGE=

"lunovia_coupons";

const APPLIED_COUPON_STORAGE=

"lunovia_applied_coupon";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let coupons=[];

let appliedCoupon=null;

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeCoupons

);

function initializeCoupons(){

loadCoupons();

loadAppliedCoupon();

seedDefaultCoupons();

}

/*==================================================
LOAD
==================================================*/

function loadCoupons(){

coupons=

JSON.parse(

localStorage.getItem(

COUPONS_STORAGE

)

)||[];

}

/*==================================================
SAVE
==================================================*/

function saveCoupons(){

localStorage.setItem(

COUPONS_STORAGE,

JSON.stringify(

coupons

)

);

}

/*==================================================
APPLIED COUPON
==================================================*/

function loadAppliedCoupon(){

appliedCoupon=

JSON.parse(

localStorage.getItem(

APPLIED_COUPON_STORAGE

)JSON.stringify(

appliedCoupon

)

);

}

)||null;

}

function saveAppliedCoupon(){

localStorage.setItem(

APPLIED_COUPON_STORAGE,

JSON.stringify(

appliedCoupon

)
/*==================================================
COUPON DATA
Version 1.1
==================================================*/

/*=========================================
DEFAULT COUPONS
=========================================*/

function seedDefaultCoupons(){

if(coupons.length>0){

return;

}

coupons=[

{

code:"WELCOME10",

type:"percentage",

value:10,

minimum:50,

expires:"2099-12-31",

usageLimit:1000,

used:0,

active:true

},

{

code:"SAVE20",

type:"fixed",

value:20,

minimum:100,

expires:"2099-12-31",

usageLimit:500,

used:0,

active:true

},

{

code:"FREESHIP",

type:"shipping",

value:0,

minimum:75,

expires:"2099-12-31",

usageLimit:1000,

used:0,

active:true

}

];

saveCoupons();

}

/*=========================================
CREATE COUPON
=========================================*/

function createCoupon(coupon){

coupon.code=

String(coupon.code)

.trim()

.toUpperCase();

coupon.used=0;

coupon.active=true;

coupons.push(

coupon

);

saveCoupons();

}

/*=========================================
GET COUPON
=========================================*/

function getCoupon(

code

){

return coupons.find(

coupon=>

coupon.code===

String(code)

.trim()

.toUpperCase()

);

}

/*=========================================
CHECK ACTIVE
=========================================*/

function isCouponActive(

coupon

){

if(

!coupon||

!coupon.active

){

return false;

}

return true;

}

/*=========================================
CHECK EXPIRY
=========================================*/

function isCouponExpired(

coupon

){

return new Date()

>

new Date(

coupon.expires

);

}

/*=========================================
CHECK USAGE
=========================================*/

function hasCouponUsageLeft(

coupon

){

return

coupon.used

<

coupon.usageLimit;

  }
/*==================================================
APPLY COUPON
Version 1.2
==================================================*/

/*=========================================
VALIDATE
=========================================*/

function validateCoupon(

coupon,

subtotal

){

if(!coupon){

return{

valid:false,

message:"Invalid coupon."

};

}

if(

!isCouponActive(

coupon

)

){

return{

valid:false,

message:"Coupon is inactive."

};

}

if(

isCouponExpired(

coupon

)

){

return{

valid:false,

message:"Coupon has expired."

};

}

if(

!hasCouponUsageLeft(

coupon

)

){

return{

valid:false,

message:"Coupon usage limit reached."

};

}

if(

subtotal<

coupon.minimum

){

return{

valid:false,

message:

`Minimum order is $${coupon.minimum}.`

};

}

return{

valid:true

};

}

/*=========================================
CALCULATE DISCOUNT
=========================================*/

function calculateCouponDiscount(

coupon,

subtotal,

shipping=0

){

let discount=0;

let shippingDiscount=0;

switch(coupon.type){

case"percentage":

discount=

subtotal*

coupon.value/

100;

break;

case"fixed":

discount=

coupon.value;

break;

case"shipping":

shippingDiscount=

shipping;

break;

}

discount=

Math.min(

discount,

subtotal

);

return{

discount,

shippingDiscount

};

}

/*=========================================
APPLY
=========================================*/

function applyCoupon(

code,

subtotal,

shipping=0

){

const coupon=

getCoupon(code);

const validation=

validateCoupon(

coupon,

subtotal

);

if(

!validation.valid

){

return validation;

}

appliedCoupon={

...coupon

};

saveAppliedCoupon();

return{

valid:true,

coupon,

...calculateCouponDiscount(

coupon,

subtotal,

shipping

)

};

}

/*=========================================
REMOVE
=========================================*/

function removeCoupon(){

appliedCoupon=null;

saveAppliedCoupon();

}
 /*==================================================
COUPON MANAGEMENT
Version 1.3
==================================================*/

/*=========================================
CONFIRM COUPON USAGE
=========================================*/

function confirmCouponUsage(){

if(!appliedCoupon){

return;

}

const coupon=

coupons.find(

item=>

item.code===

appliedCoupon.code

);

if(!coupon){

return;

}

coupon.used++;

saveCoupons();

removeCoupon();

}

/*=========================================
UPDATE COUPON
=========================================*/

function updateCoupon(

code,

data

){

const coupon=

getCoupon(code);

if(!coupon){

return false;

}

Object.assign(

coupon,

data

);

saveCoupons();

return true;

}

/*=========================================
DELETE COUPON
=========================================*/

function deleteCoupon(

code

){

coupons=

coupons.filter(

coupon=>

coupon.code!==

String(code)

.toUpperCase()

);

saveCoupons();

}

/*=========================================
GET ACTIVE COUPONS
=========================================*/

function getActiveCoupons(){

return coupons.filter(

coupon=>

coupon.active &&

!isCouponExpired(coupon)

);

}

/*=========================================
RESET USAGE
=========================================*/

function resetCouponUsage(

code

){

const coupon=

getCoupon(code);

if(!coupon){

return;

}

coupon.used=0;

saveCoupons();

}

/*=========================================
EXPORT COUPONS
=========================================*/

function exportCoupons(){

const blob=

new Blob(

[

JSON.stringify(

coupons,

null,

2

)

],

{

type:

"application/json"

}

);

const url=

URL.createObjectURL(

blob

);

const link=

document.createElement(

"a"

);

link.href=url;

link.download=

"lunovia-coupons.json";

link.click();

URL.revokeObjectURL(

url

);

}

/*=========================================
GET APPLIED COUPON
=========================================*/

function getAppliedCoupon(){

return appliedCoupon;

  } 
