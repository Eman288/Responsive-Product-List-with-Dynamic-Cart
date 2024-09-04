//json object handling

let jsonData = [];  // Initialize jsonData as an empty array

fetch('../data.json')
.then(response => response.json())
.then(data => {
    jsonData = data;  // Assign the fetched data to jsonData
    // Call the function to create cards after the data is loaded
    window.onload = function() {
        jsonData.forEach((element, index) => {
            createCard(index + 1, element.category, element.name, element.price, element.image.desktop);
        });
    };
})
.catch(error => {
    console.error('Error loading JSON:', error);
});


let numOfOrders = 0;
let total = 0;

var dict = {}; //or new Object()

/*a function to display the right cart*/
function isCartEmpty()
{
  /*check if the orders are 0, display the "order-none" box*/
  if (numOfOrders === 0)
  {
    document.querySelector('#order-there').style.display = 'none';
    document.querySelector('#order-none').style.display = 'flex';
  }
  else {
    document.querySelector('#order-none').style.display = 'none';
    document.querySelector('#order-there').style.display = 'block';
  }
}

/*a function to show the add button and change what needed*/
function showAddButton(num) {
  let parentName = '.c' + num;
  let p = document.querySelector(parentName);
  
  p.querySelector('.Add').style.display = 'flex';
  p.querySelector('.noAdd').style.display = 'none';

  /*show the border for the card*/
  p.querySelector('.card-img').style.border = '2px solid #c55839';
}

//a funtion to add the wanted item to the cart
function addOrderItem(num) {
  let card = document.querySelector('.c' + num);
  let ele = card.querySelector('.Add');
  let price = card.querySelector('.card-price').innerHTML;
  price = +(price.replace('$', ''));
  //change the quantity for the order
  if (dict[num] === undefined)
  {
    dict[num] = 1;
    let cardName = card.querySelector('.card-name').innerHTML;
    createOrder(num, cardName, price, 1);
  }
  else {
    dict[num] = dict[num] + 1;
  }
  numOfOrders = numOfOrders + 1;
  //display the new value
  ele.querySelector('p').innerHTML = dict[num];

  //display the total number of orders after change
  document.querySelector('.cart-total').innerHTML = `Your Cart (${numOfOrders})`;

  //add the price to the total
  
  total = total + price;

  //display the total after change
  document.querySelector('.total').innerHTML = `$${total}`;
  displayOrderAmount(num, price);
}

//a funtion to remove the wanted item to the cart
function removeOrderItem(num) {
  let ele = document.querySelector('.c' + num).querySelector('.Add');

  //change the quantity for the order
  if (dict[num] === undefined || dict[num] == 0)
  {
    alert('You need to add an item to be able to delete it');
  }
  else {
    dict[num] = dict[num] - 1;
    numOfOrders = numOfOrders - 1;

    //display the new value
    ele.querySelector('p').innerHTML = dict[num];

    //display the total number of orders after change
    document.querySelector('.cart-total').innerHTML = `Your Cart (${numOfOrders})`;

    //add the price to the total
    let price = document.querySelector('.c' + num).querySelector('.card-price').innerHTML;
    price = +(price.replace('$', ''));
    total = total - price;
  
    //display the total after change
    document.querySelector('.total').innerHTML = `$${total}`;

    //if the order total reached 0
    if (dict[num] === 0)
    {
      removeOrder(num);
    }
    else {
      displayOrderAmount(num, price);
    }
  }

}

//create order object
function createOrder(num, name, price, total) {
  let orderHolder = document.querySelector('.orders');

  let newOrder = document.createElement('div');
  newOrder.id = `o${num}`;
  newOrder.className = 'order';

  //create the order details div
  let orderDetails = document.createElement('div');
  orderDetails.className = 'order-details';
  orderDetails.innerHTML = `
        <p>${name}</p>
        <p class="order-cost"><span>${total}x</span> ${price} ${total * price}</p>
  `;
  newOrder.appendChild(orderDetails);

  //create the remove-order div
  let removeOrder = document.createElement('div');
  removeOrder.className = 'remove-order';
  //add the onclick function to remove the whole order
  
  removeOrder.onclick = function() {
    removeOrderAll(num);  // Call the function with the parameter
  };

  newOrder.appendChild(removeOrder);

  //append the whole order
  orderHolder.appendChild(newOrder);
}

//remove order object
function removeOrder(num) {
  let orderHolder = document.querySelector('.orders');
  let order = document.querySelector(`#o${num}`);
  orderHolder.removeChild(order);
}

//remove all order basket
function removeOrderAll(num) {
  let card = document.querySelector('.c' + num);
  let price = card.querySelector('.card-price').innerHTML;
  let  ele = card.querySelector('.Add');

  price = +(price.replace('$', ''));

  removeOrder(num);

  total = total - (dict[num] * price);

  numOfOrders = numOfOrders - dict[num];

  //display the total number of orders after change
  document.querySelector('.cart-total').innerHTML = `Your Cart (${numOfOrders})`;

  //display the total after change
  document.querySelector('.total').innerHTML = `$${total}`;

  dict[num] = undefined;

  //fix the card

  //display the new value
  ele.querySelector('p').innerHTML = 0;

}

//display order amount
function displayOrderAmount(num, price) {
  let order = document.querySelector(`#o${num}`);
  order.querySelector('.order-cost').innerHTML = 
  `
  <span>${dict[num]}x</span> $${price} $${dict[num] * price}
  `;
}

//create card
function createCard(num, shortName, name, price, imgURL, type) {
  let cardHolder = document.querySelector('.desserts-cards');

  let newCard = document.createElement('div');
  newCard.className = `c${num} card`;

  newCard.innerHTML = `
      <!--image-->
      <div class="card-img" style="background-image: url(${imgURL});">
        <button class="noAdd" onclick="showAddButton(${num})">
          <img src="assets/images/icon-add-to-cart.svg" alt="error"> 
          <p>Add to Cart</p>
        </button>

        <button class="Add">
          <img src="assets/images/icon-decrement-quantity.svg" alt="error" onclick="removeOrderItem(${num}); isCartEmpty()"> 
          <p>0</p>
          <img src="assets/images/icon-increment-quantity.svg" alt="error" onclick="addOrderItem(${num}); isCartEmpty()"> 
        </button>

      </div>

      <!--text content-->

      <div class="card-text">
        <p class="card-light-text">${shortName}</p>
        <p class="card-name">${name}</p>
        <p class="card-price">$${price}</p>
      </div>
  `;

  // //create the image area
  // let cardImg = document.createElement('div');
  // cardImg.className = 'card-img';
  // cardImg.style.backgroundImage = imgURL;

  // cardImg.innerHTML = `
  //       <button class="noAdd" onclick="showAddButton(${num})">
  //         <img src="assets/images/icon-add-to-cart.svg" alt="error"> 
  //         <p>Add to Cart</p>
  //       </button>

  //       <button class="Add">
  //         <img src="assets/images/icon-decrement-quantity.svg" alt="error" onclick="removeOrderItem(${num}); isCartEmpty()"> 
  //         <p>0</p>
  //         <img src="assets/images/icon-increment-quantity.svg" alt="error" onclick="addOrderItem(${num}); isCartEmpty()"> 
  //       </button>
  // `;

  // //appending the cardImg 
  // newCard.appendChild(cardImg);

  // //create the text area for the card
  // let cardText = document.createElement('div');
  // cardText.className = 'card-text';
  // cardText.innerHTML = `
  //       <p class="card-light-text">${shortName}</p>
  //       <p class="card-name">${name}</p>
  //       <p class="card-price">$${price}</p>
  // `;
  // newCard.appendChild(cardText);

  //append the card to the page
  cardHolder.appendChild(newCard);
}

//confirm order
function confirmOrder() {
  //GET the confirmation from the user
    // the code here
  let c = confirm("are you sure you want to continue?");

  if (c) {
    //show the payment window
    let confirmLog = document.querySelector('.confirm');
    confirmLog.style.display = "flex";
    document.querySelector('main').style.filter = 'brightness(0.5)';

    //display all the orders
    for (i = 0; i < jsonData.length; i++)
    {
      if (dict[i + 1] !== undefined) {
        
        createPOrder(jsonData[i].name, jsonData[i].price, dict[i + 1], jsonData[i].image.thumbnail);
      }
    }



    //show the total
    document.querySelector('.confirm').querySelector('.total').innerHTML = `$${total}`;
  }
}

//create payment order
function createPOrder (name, price, total, url) {
  let orderHolder = document.querySelector('.orders-pay');

  let newOrder = document.createElement('div');
  newOrder.className = 'order orderp';

 newOrder.innerHTML = `
      <div class="order-details pay">
        <img src="${url}" alt="">
        <div class="pay-text">
          <p>${name}</p>
          <p class="order-cost">
          <span>${total}x</span> $${price} $${price * total}
          </p>
        </div>
      </div>
      <div class="total-order">
        <p>$${price * total}</p>
      </div>
 `;

  //append the whole order
  orderHolder.appendChild(newOrder);
}

//start a new order
function restartOrder() {
  let confirmLog = document.querySelector('.confirm');
    confirmLog.style.display = "none";
    document.querySelector('main').style.filter = 'brightness(1)';
    location.reload();        
}