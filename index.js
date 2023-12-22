$(document).ready(function () {
  let selectItem_Array = [];
  let current_Date = new Date().getDay();
  let current_Hour = new Date().getHours();
  // Display cart
  $(".photo img").click(function () {
    $(".cart ").slideDown(1000);

    // Take the product detail data
    const productName = $(this).closest(".card").find(".pname").text();
    const productCode = $(this).closest(".card").find(".code").text();
    const productImage = $(this)
      .closest(".card")
      .find(".photo img")
      .attr("src");
    const productPrice = Number(
      $(this).closest(".card").find(".price").text().replace(",", "")
    );

    // check if the item is already selected or not
    if (isSelectedOne(productName, productCode)) {
      return;
    }

    // add the product data(obj) to the selectItem_Array
    selectItem_Array.push({
      name: productName,
      code: productCode,
      image: productImage,
      price: productPrice,
      quantity: 1, // Initialize quantity to 1 when adding a new item
    });

    updateCart();
  });

  // listen for changes in the delivery select element
  $("#delivery").change(function () {
    updateCart();
  });

  /**
   * Checking if it's already a selected item
   * @param {*} name
   * @param {*} code
   * @returns true/false
   */
  function isSelectedOne(name, code) {
    for (const clicked of selectItem_Array) {
      if (clicked.name === name && clicked.code === code) {
        alert("You have already selected this item.");
        return true;
      }
    }
    return false;
  }

  /**
   * update the cart
   */
  function updateCart() {
    //clear items in the cart
    $(".calculateitem").empty();

    let grandTotal = 0;

    // add each selected item to the cart
    selectItem_Array.forEach((item, index) => {
      const itemData_Container = $('<div class="item"></div>');
      itemData_Container.append(
        '<img src="' + item.image + '" alt="' + item.name + '">'
      );
      itemData_Container.append('<div class="pname">' + item.name + "</div>");
      itemData_Container.append('<div class="code">' + item.code + "</div>");

      // InputBox for quantity
      const input_QuantityBox = $(
        '<input type="text" class="quantity" value="' +
          item.quantity +
          '"></input>'
      );

      // taking a limit for quantity box
      $(input_QuantityBox).blur(function () {
        const quantity = Number($(this).val()) || 1; // Default to 1 if not a valid number
        if (quantity > 0 && quantity < 10) {
          item.quantity = quantity;
        } else {
          alert("Enter a quantity from 1 to 9 only");
          $(this).val(1);
          item.quantity = 1;
        }

        // update the cart when  quantity changes
        updateCart();
      });

      itemData_Container.append(input_QuantityBox);

      // Bin_Img to remove item
      const bin_Img = $('<img src="./delete-icon.svg" alt="" class="bin_Img">');
      $(bin_Img).click(function () {
        // remove the item from the selectItem_Array array
        selectItem_Array.splice(index, 1);

        updateCart();
        orderHide();
      });
      itemData_Container.append(bin_Img);

      if (
        current_Date == 3 ||
        (current_Date == 6 && current_Hour >= 9 && current_Hour < 17)
      ) {
        let disPrice = item.price - (15 / item.price) * item.price;
        $("#discounttitle").show();
        $(".amount").text(new Intl.NumberFormat().format(disPrice) + "Ks");
        // calculate total amount
        grandTotal += disPrice * item.quantity;

        // calculate total amount and delivery fee
        const deliveryPrice = Number($("#delivery").val());
        const totalWithDelivery = grandTotal + deliveryPrice;

        $("#grand").text(
          new Intl.NumberFormat().format(totalWithDelivery.toFixed(0)) + "Ks"
        );
        orderHide(); //after total cost change , order letter will hide
      } else {
        // calculate total amount
        grandTotal += item.price * item.quantity;

        // calculate total amount and delivery fee
        const deliveryPrice = Number($("#delivery").val());
        const totalWithDelivery = grandTotal + deliveryPrice;

        $("#grand").text(
          new Intl.NumberFormat().format(totalWithDelivery.toFixed(0)) + "Ks"
        );
        orderHide();
      }

      $(".calculateitem").append(itemData_Container);
    });

    slideUp();
  }

  /**
   * In the cart, after all items were removed, the cart will slideUp
   */
  function slideUp() {
    if (selectItem_Array.length == 0) {
      $(".cart").slideUp(1000);
    }
  }
  order();

  /**
   * order letter
   */
  function order() {
    $(".order").click(function () {
      if (
        !$(".userinfo").val() ||
        !$(".userinfoaddress").val() ||
        !$(".userinfoPh").val()
      ) {
        alert("Pls insert your information");
        orderHide();
      } else {
        $(".data1")
          .text("Thank You  " + $(".userinfo").val())
          .slideDown(1000);

        $(".data2").text("We received your order!").slideDown(1000);

        $(".data3")
          .text(
            "We will deliver to your place at " + $(".userinfoaddress").val()
          )
          .slideDown(1000);

        $(".data4")
          .text(
            "Before deliver we will inform to your phone " +
              $(".userinfoPh").val()
          )
          .slideDown(1000);
      }
    });
  }

  /**
   * for hide order letter
   */
  function orderHide() {
    $(".data1").hide();
    $(".data2").hide();
    $(".data3").hide();
    $(".data4").hide();
  }
 
  
});
