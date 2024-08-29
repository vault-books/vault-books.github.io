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
        return "linear-gradient(to top    left,  #F00, transparent)";
    }
    else {
        return "linear-gradient(to top    left,  #00F, transparent)";
    }
    return `linear-gradient(to top    left,  #${random_hex()}, transparent),`+
           `linear-gradient(to top    right, #${random_hex()}, transparent),`+
           `linear-gradient(to bottom left,  #${random_hex()}, transparent),`+
           `linear-gradient(to bottom right, #${random_hex()}, transparent)`;
}

/**
 * creates and sets up the background elements if required.
 * runs the first transition.
 */
function setup_gradient_changes(gradient = null) {
    console.log("setting up gradient changes")
    if (!gradient) {
        gradient = random_gradient();
    }

    // set all background-primary and background-secondary elements to the designated gradient.
    root.style.setProperty("--background-gradient-primary"  ,gradient);
    root.style.setProperty("--background-gradient-secondary",gradient);

    var color_effect_elements = document.getElementsByClassName("background-placer");

    // loop over all elements with the class background-placer
    for (let i=0; i<color_effect_elements.length; i++) {
        var element = color_effect_elements[i];

        // count the number of elements with both background-primary and background-secondary classes
        var double_count = element.getElementsByClassName("background-primary background-secondary").length;

        // if there are any double ups then warn the console and remove the background-secondary class from all of them.
        if (double_count > 0) {
            console.warn("Elements cannot use both background-primary and background-secondary classes. The background-secondary class will be removed from all that have both.");

            element.getElementsByClassName("background-primary background-secondary").forEach(element => element.classList.remove("background-secondary"))
        }

        // tally up the background-primary and background-secondary elements.
        var background_primary_count = element.getElementsByClassName("background-primary").length;
        var background_secondary_count = element.getElementsByClassName("background-secondary").length;

        if (background_primary_count >= 2) {
            // warn the console but don't change anything
            console.warn("Multuple elements with the class background-primary found.");
        }

        // if no background-primary was found then make one.
        if (background_primary_count == 0) {
            var primaryDiv = document.createElement("div");
            primaryDiv.className = "background-primary";
            element.prepend(primaryDiv);
        }

        // if no background-secondary was found then make one.
        if (background_secondary_count == 0) {
            // since we removed the background-secondary class from all the double ups warn the console
            // that this could have caused the current lack of background-secondary element.
            if (double_count > 0) {
                console.warn("No background-secondary class found but one was removed earlyer due to the presence of a background-primary class. One will be created now.");
            }

            var secondaryDiv = document.createElement("div");
            secondaryDiv.classList = "background-secondary";
            element.prepend(secondaryDiv);
        }

        // put the backgrounds into the correct order. This is required for the fading effect to work.
        reorder_children(element);
    }
    // prevents initial black screen before fist transiiton.
    console.log("calling next gradient")
    next_gradient();
}

function reorder_children(element) {
    // Gather all primary, secondary, and normal elements
    var primaryElements = Array.from(element.getElementsByClassName('background-primary'));
    var secondaryElements = Array.from(element.getElementsByClassName('background-secondary'));
    var otherElements = Array.from(element.children).filter(child =>
        !child.classList.contains('background-primary') && !child.classList.contains('background-secondary')
    );

    // Clear the element
    element.innerHTML = '';

    // Append secondary elements
    secondaryElements.forEach(secondary => element.appendChild(secondary));
    // Append primary elements
    primaryElements.forEach(primary => element.appendChild(primary));


    // Append other elements
    otherElements.forEach(other => element.appendChild(other));
}

var current_gradient = random_gradient();
function next_gradient(gradient=null) {
    console.log("next gradient");
    if (!gradient) {
        gradient = random_gradient();
    }

    // set the gradient of all background-secondary elements to the old gradient to cover the gradient change for the background-primary elements.
    $(".background-secondary").css("background-image",current_gradient).show();

    current_gradient = gradient;
    $(".background-primary").css("background-image",current_gradient);

    // the fade out is gradual
    $(".background-secondary").fadeOut(2000,"linear",next_gradient);
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
console.log("Script loaded")
document.addEventListener("DOMContentLoaded",setup_gradient_changes);