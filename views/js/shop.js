import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.es.js";

const cartItems = [];
const viewInvoiceBtn = document.getElementById("view-invoice");
const downloadInvoiceBtn = document.getElementById("download-invoice");
const pdfPreview = document.getElementById("pdf-preview");

function RandomInvoiceNumber() {
  return Math.floor(Math.random() * 100000000);
}
//rando numb

function generatePDF() {
  const doc = new jsPDF();
  const invoiceNumber = RandomInvoiceNumber();
  doc.setFontSize(22);
  doc.text(`Invoice Number: #${invoiceNumber}`, 10, 10);

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  doc.setFontSize(12);
  doc.text(`Customer Name: ${name}`, 10, 40);
  doc.text(`Customer Email: ${email}`, 10, 50);

  //DATE O PURCHASE
  const purchaseDate = new Date().toLocaleString();
  doc.text(`Date of Purchase: ${purchaseDate}`, 10, 60);

  let yPosition = 70;

  cartItems.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} - $${item.price} x ${item.quantity} = $${
        item.price * item.quantity
      }`,
      15,
      yPosition
    );
    yPosition += 10;
  });

  // idc who the IRS sends I am not paying TAXES (taxes 🔽)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.07;
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax;

  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 10, yPosition + 10);
  doc.text(`Tax (7%): $${tax.toFixed(2)}`, 10, yPosition + 20);
  doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 10, yPosition + 30);

  return doc;
}
//KEEP THIS HERE IT NEEDS IT
viewInvoiceBtn.addEventListener("click", () => {
  const doc = generatePDF();
  const pdfUrl = doc.output("bloburl");
  pdfPreview.src = pdfUrl;
});

downloadInvoiceBtn.addEventListener("click", () => {
  const doc = generatePDF();
  doc.save("Invoice.pdf");
});

const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const name = event.target.getAttribute("data-name");
    const price = parseFloat(event.target.getAttribute("data-price"));
    const existingItem = cartItems.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ name, price, quantity: 1 });
    }

    updateCart();
  });
});

//megan come back to this
function updateCart() {
  const cartTable = document.getElementById("cart-items");
  cartTable.innerHTML = `
    <tr>
      <th>Product Name</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Line Total</th>
    </tr>
  `;

  cartItems.forEach((item) => {
    const row = cartTable.insertRow();
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td>${item.quantity}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    `;
  });
}
