/* =========================================
   SCRUB MATE SERVICE QUANTITY
========================================= */

const scurbServiceQuantities = {};


/* ALL PLUS BUTTONS */

document
  .querySelectorAll(".scurbServiceAddBtn")
  .forEach(function(addButton){

    addButton.addEventListener("click", function(event){

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const serviceCard =
        this.closest(".scurbServiceCard");

      if(!serviceCard){
        return;
      }

      const serviceId = serviceCard.id;

      if(!scurbServiceQuantities[serviceId]){
        scurbServiceQuantities[serviceId] = 1;
      }

      renderScurbServiceQuantity(
        this,
        serviceId
      );

    });

  });


/* RENDER − QUANTITY + */

function renderScurbServiceQuantity(addButton, serviceId){

    const qty = scurbServiceQuantities[serviceId] || 0;

    if(qty <= 0){

        addButton.classList.remove("scurbQtyMode");

        addButton.innerHTML = `<span class="scurbSinglePlus">+</span>`;

        addButton.onclick = function(e){
            e.stopPropagation();
            scurbServiceQuantities[serviceId] = 1;
            renderScurbServiceQuantity(addButton, serviceId);
        };

        return;
    }

    addButton.classList.add("scurbQtyMode");

    addButton.innerHTML = `
        <button class="scurbServiceMinus">−</button>
        <span class="scurbServiceQty">${qty}</span>
        <button class="scurbServicePlus">+</button>
    `;

    addButton.querySelector(".scurbServiceMinus").onclick=function(e){

        e.preventDefault();
        e.stopPropagation();

        scurbServiceQuantities[serviceId]--;

        renderScurbServiceQuantity(addButton,serviceId);

    };

    addButton.querySelector(".scurbServicePlus").onclick=function(e){

        e.preventDefault();
        e.stopPropagation();

        scurbServiceQuantities[serviceId]++;

        renderScurbServiceQuantity(addButton,serviceId);

    };

}


/* MINUS AND PLUS EVENT DELEGATION */

document.addEventListener("click", function(event){

  const minusButton =
    event.target.closest(".scurbServiceMinus");

  const plusButton =
    event.target.closest(".scurbServicePlus");


  /* MINUS */

  if(minusButton){

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const addButton =
      minusButton.closest(".scurbServiceAddBtn");

    const serviceCard =
      minusButton.closest(".scurbServiceCard");

    if(!addButton || !serviceCard){
      return;
    }

    const serviceId = serviceCard.id;

    scurbServiceQuantities[serviceId] =
      Math.max(
        0,
        (scurbServiceQuantities[serviceId] || 0) - 1
      );

    renderScurbServiceQuantity(
      addButton,
      serviceId
    );

    return;
  }


  /* PLUS */

  if(plusButton){

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const addButton =
      plusButton.closest(".scurbServiceAddBtn");

    const serviceCard =
      plusButton.closest(".scurbServiceCard");

    if(!addButton || !serviceCard){
      return;
    }

    const serviceId = serviceCard.id;

    scurbServiceQuantities[serviceId] =
      (scurbServiceQuantities[serviceId] || 0) + 1;

    renderScurbServiceQuantity(
      addButton,
      serviceId
    );

  }

});