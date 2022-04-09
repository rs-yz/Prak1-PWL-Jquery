// what is clean code? IDK

// assume its name is unique to each others
let inventories = {
    "Falcon 9": 3,
    "Tesla Model S": 70,
    "Tesla Model 3": 69,
    "Tesla Model X": 4,
    "Tesla Model Y": 20
};


function getDiff(obj1, obj2) {
    const keys = Object.keys(obj1).filter(key => key in obj2);

    const inv = Object.assign({}, obj1)
    for (const key of keys) {
        delete inv[key]
    }

    return inv
}

function validate() {
    const orders = getOrders();
    if (Object.keys(orders).length <= 0) {
        return false
    }

    for (const id of Object.keys(orders)) {
        if (orders[id] <= 0 || orders[id] > inventories[id]) {
            return false
        }
    }

    return true
}

function getOrder(item, count) {
    return `<li>${item} (${count})</li>`
}

function getName() {
    const name = $("#input-name").val();

    return `<h2>${name}</h2>`;
}

function getOrders() {
    const orders = {};

    $("#select-product div").each(function() {
        const id = $(this).find($("select option:selected")).val();
        const val = $(this).find($("input")).val()

        if (id === "Pilih Produk") {
            return
        }

        orders[id] = val;
    })

    return orders;
}

function constructOrderDetail() {
    const name = getName();
    const orders = getOrders();
    const items = Object.keys(orders).map(id => getOrder(id, orders[id]));

    return [
        name,
        "<ul>",
        ...items,
        "</ul>"
    ].join("\n");
}

function showSummary() {
    const orderDetail = constructOrderDetail()

    $("#summary").html(orderDetail)
}

function newProductOption(products) {
    const opts = Object.keys(products).map(p => `<option value='${p}'>${p}</option>`);

    return [
        `<select>`,
        `<option selected disabled>Pilih Produk</option>`,
        opts,
        "</select>",
    ].join("\n");
}

function newProductInput() {
    return `<input text="text" value="1" class='form-control'>`;
}

function newXButton() {
    return `<button type="button" class='btn danger btn-cl'>X</button>`;
}

function xyz() {
    // order length = 0 then hide X button OK
    // order length == inventories length then hide Add Product button OK
    // Show Add Product button if the option selected  OK
    //      And set default value 1 OK
    // Disable select for <= len()-1 select OK
    // Add event onchange to each option OK

    const orders = getOrders();
    const orderCount = Object.keys(orders).length;

    const prods = getDiff(inventories, orders);

    let productOption = newProductOption(prods);
    let productInput = newProductInput();
    let xBtn = "";

    if (orderCount > 0) {
        xBtn = newXButton();
    }
    
    return [
        "<div class='flex flex-content form-group product-opt mb-3'>",
        productOption,
        productInput,
        xBtn,
        "</div>",
    ].join("\n")
}

function initProductList() {
    const po = xyz()
    $("#select-product").append(po);

    $("#select-product div select").change(function() {
        $("#add-product").show();
    })
}

function actionRemove() {
    const orders = getOrders();
    const orderCount = Object.keys(orders).length;
    const invCount = Object.keys(inventories).length;

    if (orderCount == 0) {
        return
    }

    $("#select-product div:last-child").remove();
    $("#select-product div:last-child button").show();

    $("#select-product div:last-child button").click(actionRemove);
    

    if (orderCount < invCount) {
        $("#add-product").show();
    }

    $("#select-product div:last-child select").attr("disabled", false);
}

$(function() {
    $("#add-product").hide();
    $("#add-product").click(function() {
        $("#select-product div:last-child select").attr("disabled", true)
        $("#select-product div:last-child button").hide();

        const val = parseInt($("#select-product div:last-child input").val());

        if ( isNaN(val) ) {
            alert("enter numeric please");
            return
        }

        const zzz = xyz();
        $("#select-product").append(zzz);
        $("#select-product div:last-child button").click(actionRemove);

        const orders = getOrders();
        const orderCount = Object.keys(orders).length;
        const invCount = Object.keys(inventories).length

        if (orderCount == invCount) {
            $(this).hide();
        }
    })
    initProductList();

    $("#orderBtn").click(function() {
        isEligible = validate()
        if (!isEligible) {
            alert("supply doesn't meet demand or it's invalid order")
            return
        }

        showSummary();
    })
})