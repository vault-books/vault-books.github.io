var root = document.querySelector(":root");
var root_style = getComputedStyle(root);


// #region bakcground gradient changes
function random_hex() {
    var return_value = "";
    var hex_values = "0123456789abcdef";

    for (let i=0; i < 6; i++) {
      return_value += hex_values.charAt(Math.floor(Math.random() * hex_values.length));
    }
    return return_value;
}

let toggle=true;
function random_gradient() {
    toggle = !toggle;
    if (toggle) {
        return "linear-gradient(to top    left,  #00F, transparent)";
    }
    else {
        return "linear-gradient(to top    left,  #FFF, transparent)";
    }
    return `linear-gradient(to top    left,  #${random_hex()}, transparent),`+
           `linear-gradient(to top    right, #${random_hex()}, transparent),`+
           `linear-gradient(to bottom left,  #${random_hex()}, transparent),`+
           `linear-gradient(to bottom right, #${random_hex()}, transparent)`;
}

var current_gradient = random_gradient();
function next_gradient(gradient=null) {
    console.log("next gradient");
    if (!gradient) {
        gradient = random_gradient();
    }

    // set the gradient of all background-secondary elements to the old gradient to cover the gradient change for the background-primary elements.
    $(".background-front").css("background-image",current_gradient).show();

    current_gradient = gradient;
    $(".background-back").css("background-image",current_gradient);

    // the fade out is gradual
    $(".background-front").fadeOut(2000,"linear",next_gradient);

    setTimeout(2000,next_gradient); // This approach avoids recursion limit issues.
}
// #endregion


// #region book loading code

function load_data(file) {
    let data = null
    fetch(file)
        .then(response => response.json())
        .then(books => {
            data = books;
        })
        .catch(error => console.error(`There was an error fetching ${file}:`, error));

        return data;
}




// #endregion
document.addEventListener("DOMContentLoaded",next_gradient);