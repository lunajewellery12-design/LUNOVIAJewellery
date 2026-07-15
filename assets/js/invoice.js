/*==================================================
LUNOVIA INVOICE SYSTEM
Version 1.0
==================================================*/

"use strict";

/*==================================================
LOCAL STORAGE KEYS
==================================================*/

const INVOICE_STORAGE="lunovia_invoice";

const USER_STORAGE="lunovia_session";

/*==================================================
GLOBAL VARIABLES
==================================================*/

let invoice=null;

let currentUser=null;

/*==================================================
INITIALIZE
==================================================*/

document.addEventListener(

"DOMContentLoaded",

initializeInvoice

);

function initializeInvoice(){

loadInvoice();

protectInvoice();

renderInvoice();

bindInvoiceEvents();

}

/*==================================================
LOAD DATA
==================================================*/

function loadInvoice(){

invoice=

JSON.parse(

localStorage.getItem(

INVOICE_STORAGE

)

);

currentUser=

JSON.parse(

localStorage.getItem(

USER_STORAGE

)

);

}

/*==================================================
PROTECT PAGE
==================================================*/

function protectInvoice(){

if(!invoice){

window.location.href="orders.html";

}

}

/*==================================================
GENERATE NUMBER
==================================================*/

function generateInvoiceNumber(){

return "INV-"+

invoice.id.replace(

"LNV-",

""

);

}
/*==================================================
RENDER INVOICE
Version 1.1
==================================================*/

/*=========================================
RENDER INVOICE
=========================================*/

function renderInvoice(){

if(!invoice)return;

setText("invoiceNumber",generateInvoiceNumber());

setText("invoiceOrder",invoice.id);

setText("invoiceDate",formatDate(invoice.createdAt));

setText("invoiceCustomer",invoice.customer);

setText("invoiceEmail",invoice.email);

setText("invoicePhone",invoice.phone);

setText(

"invoiceAddress",

`${invoice.shippingAddress.address},
${invoice.shippingAddress.city},
${invoice.shippingAddress.country}
${invoice.shippingAddress.postalCode}`

);

setText(

"invoicePayment",

invoice.paymentMethod

);

setText(

"invoiceShipping",

invoice.shippingMethod

);

setText(

"invoiceSubtotal",

"$"+Number(invoice.subtotal).toFixed(2)

);

setText(

"invoiceShippingPrice",

"$"+Number(invoice.shipping).toFixed(2)

);

setText(

"invoiceTax",

"$"+Number(invoice.tax).toFixed(2)

);

setText(

"invoiceDiscount",

"- $"+Number(invoice.discount).toFixed(2)

);

setText(

"invoiceTotal",

"$"+Number(invoice.total).toFixed(2)

);

renderInvoiceItems();

}

/*=========================================
RENDER PRODUCTS
=========================================*/

function renderInvoiceItems(){

const table=

document.querySelector(

"#invoiceItems"

);

if(!table)return;

table.innerHTML="";

invoice.products.forEach(

product=>{

table.innerHTML+=`

<tr>

<td>

<img

src="${product.image}"

class="invoice-product-image"

alt="${product.name}">

</td>

<td>

${product.name}

</td>

<td>

${product.quantity}

</td>

<td>

$${Number(product.price).toFixed(2)}

</td>

<td>

$${(

Number(product.price)

*

Number(product.quantity)

).toFixed(2)}

</td>

</tr>

`;

}

);

}

/*=========================================
HELPERS
=========================================*/

function setText(id,value){

const element=

document.getElementById(id);

if(element){

element.textContent=value;

}

}

function formatDate(date){

return new Date(date)

.toLocaleDateString(

undefined,

{

year:"numeric",

month:"long",

day:"numeric"

}

);

}
/*==================================================
INVOICE ACTIONS
Version 1.2
==================================================*/

/*=========================================
STORE INFORMATION
=========================================*/

const STORE_INFORMATION={

name:"LUNOVIA",

email:"support@lunovia.com",

phone:"+20 100 000 0000",

website:"www.lunovia.com",

address:"Luxury Jewellery District"

};

/*=========================================
RENDER STORE INFO
=========================================*/

function renderStoreInformation(){

setText(

"storeName",

STORE_INFORMATION.name

);

setText(

"storeEmail",

STORE_INFORMATION.email

);

setText(

"storePhone",

STORE_INFORMATION.phone

);

setText(

"storeWebsite",

STORE_INFORMATION.website

);

setText(

"storeAddress",

STORE_INFORMATION.address

);

}

/*=========================================
PRINT INVOICE
=========================================*/

function printInvoice(){

window.print();

}

/*=========================================
DOWNLOAD PDF
=========================================*/

function downloadInvoicePDF(){

showToast(

"PDF export will be enabled after integrating jsPDF.",

"info"

);

}

/*=========================================
GENERATE QR DATA
=========================================*/

function generateInvoiceQR(){

const qrContainer=

document.querySelector("#invoiceQRCode");

if(!qrContainer)return;

const qrData=

JSON.stringify({

invoice:generateInvoiceNumber(),

order:invoice.id,

customer:invoice.customer,

total:invoice.total

});

qrContainer.innerHTML=`

<div class="invoice-qr-placeholder">

<i class="fa-solid fa-qrcode"></i>

<p>QR Ready</p>

<small>${qrData}</small>

</div>

`;

}

/*=========================================
SEND EMAIL
=========================================*/

function sendInvoiceEmail(){

showToast(

"Email delivery will be activated after backend integration.",

"info"

);

}

/*=========================================
BUTTON EVENTS
=========================================*/

function bindInvoiceEvents(){

const printButton=

document.querySelector("#printInvoice");

if(printButton){

printButton.addEventListener(

"click",

printInvoice

);

}

const pdfButton=

document.querySelector("#downloadInvoice");

if(pdfButton){

pdfButton.addEventListener(

"click",

downloadInvoicePDF

);

}

const emailButton=

document.querySelector("#sendInvoice");

if(emailButton){

emailButton.addEventListener(

"click",

sendInvoiceEmail

);

}

}

/*=========================================
INITIALIZE EXTRA DATA
=========================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

renderStoreInformation();

generateInvoiceQR();

});

