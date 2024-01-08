$(function() {
  display(false);

  window.addEventListener('message', function(e) {
    let item = e.data;
    if (item.type === 'ui') {
      display(item.status);
      if (item.status) updateUI(item.metadata);
    };
  });

  function updateReceiptHeight() {
    const baseHeight = 300, itemHeight = 20, maxVisibleItems = 8;
    const itemCount = $('.item').length;
    const extraItems = Math.max(itemCount - maxVisibleItems, 0);
    const newHeight = baseHeight + (extraItems * itemHeight);
    $('.Receipt').css("height", `${newHeight}px`);
  }

  function updateUI(metadata) {
    $('.header div:nth-child(1)').html('Date: ' + metadata.date);
    $('.header div:nth-child(2)').html('Time: ' + metadata.time);
    $('.business-name').html(metadata.type);
    $('.item').remove();
  
    for (let i = 1; metadata[`item${i}`] && metadata[`price${i}`]; i++) {
      const itemDiv = `
        <div class="item">
          <div class="description">${metadata[`item${i}`]}</div>
          <div class="price">${moneyFormat(metadata[`price${i}`])}</div>
        </div>
        `;
      $('.Receipt').append(itemDiv);
    };
  
    let totalCost = Object.keys(metadata)
      .filter(key => key.startsWith('price'))
      .reduce((acc, key) => acc + parseFloat(metadata[key]), 0);
  
    $('.sub-total').html(`Sub Total: ${moneyFormat(totalCost)}`);
    $('.tax-amount').html(`Tax: ${moneyFormat(metadata.tax_amount)}`);
    $('.grand-total').html(`Total: ${moneyFormat(metadata.total_after_tax)}`);
    updateReceiptHeight();
  };

  function moneyFormat(number) {
    return "$" + parseFloat(number).toFixed(2);
  };  

  function display(bool) {
    // $('body').fadeToggle("100", bool);
    if (bool) {
      $('body').fadeIn("100");
    } else {
      $('body').fadeOut("100");
    }
  };
  
  $(document).on("keyup", function (e) {
    if (e.which == 27) {
      display(false);
      $.post(`http://${GetParentResourceName()}/closeUI`);
    }
  });
});
