var root = document.querySelector(":root");
var root_style = getComputedStyle(root);

function random_hex() {
    var return_value = "";
    var hex_values = "0123456789abcdef";

    for (let i=0; i < 6; i++) {
      return_value += hex_values.charAt(Math.floor(Math.random() * hex_values.length));
    }
    return return_value;
}

function random_gradient() {
    return `linear-gradient(to top    left,  #${random_hex()}, transparent),`+
           `linear-gradient(to top    right, #${random_hex()}, transparent),`+
           `linear-gradient(to bottom left,  #${random_hex()}, transparent),`+
           `linear-gradient(to bottom right, #${random_hex()}, transparent)`;
}

function setup_gradient_changes(gradient = null) {
    if (!gradient) {
        gradient = random_gradient()
    }

    var color_effect_elements = document.getElementsByClassName("background-placer");

    // loop over all elements with the class background-placer
    for (let i=0; i<color_effect_elements.length; i++) {
        var element = color_effect_elements[i];

        var found_background_primary = false;   // background-primary
        var found_background_secondary = false; // background-secondary

        // if an element with both background-primary and background-secondary classes is found
        // then the background-secondary class will be removed. Remember this so that if no
        // background-secondary element is found then we can appropriatly warn the console.
        var found_double = false;

        // loop over all the elements children
        for (let j=0; j<element.children.length; j++) {
             var child = element.children[j];

            if (child.classList.contains("background-primary")) {
                // if the element has both background classes then remove the background-secondary class and warn the console.
                // also take note of this because if no background-secondary element is found then it may be that this element
                // only has the background-primary by mistake and was intended as a background-secondary element.
                if (child.classList.contains("background-secondary")) {
                    console.warn("Elements cannot use both background-primary and background-secondary classes. Removing background-secondary.");
                    child.classList.remove("background-secondary");
                    found_double = true;
                }

                // if a background-primary class has already been found
                if (found_background_primary) {
                    // warn the console but don't change anything
                    console.warn("Multuple elements with the class background-primary found.");
                }

                // set the gradient of the background. This makes sure all backgrounds are consistant.
                root.style.setProperty("--background-gradient-primary",gradient);
                // getComputedStyle(child).backgroundImage = gradient; // TODO: remove if alternative works

                found_background_primary = true;
            }
            else if (child.classList.contains("background-secondary")) {
                root.style.setProperty("--background-gradient-secondary",gradient);
                getComputedStyle(child).backgroundImage = gradient;
                found_background_secondary = true;
            }
            else {
                continue;
            }
        }

        // if no background-primary was found then make one.
        if (!found_background_primary) {
            var primaryDiv = document.createElement("div");
            primaryDiv.className = "background-primary";
            getComputedStyle(primaryDiv).backgroundImage = gradient;
            element.prepend(primaryDiv);
        }

        // if no background-secondary was found then make one.
        if (!found_background_secondary) {
            if (found_double) {
                console.warn("No background-secondary class found but one was removed earlyer due to the presence of a background-primary class. One will be created now.");
            }
            var secondaryDiv = document.createElement("div");
            secondaryDiv.classList = "background-secondary";
            element.prepend(secondaryDiv);
        }

        reorder_children(element);
    }
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

    // Append primary elements
    primaryElements.forEach(primary => element.appendChild(primary));

    // Append secondary elements
    secondaryElements.forEach(secondary => element.appendChild(secondary));

    // Append other elements
    otherElements.forEach(other => element.appendChild(other));
}

document.addEventListener("DOMContentLoaded",setup_gradient_changes);

var already_warned = false
function next_gradient(gradient=null) {
    var color_effect_elements = document.getElementsByClassName("background-placer");

    for (let i=0; i<color_effect_elements.length; i++) {
        var element = color_effect_elements[i];

        // loop over all background-primary elements and establish a gradient (old_grad).
        var old_grad = null
        for (let j=0; j<element.children.length; j++) {
            var child = element.children[j];

            // because of the setup_gradient_changes call we can assume that elements will be either background-primary, background-secondary, or neither, but never both.
            if (child.classList.contains("background-primary")) {
                // warn the console if the element has a different gradient to an element we have already seen.
                if (old_grad && old_grad != getComputedStyle(child).backgroundImage && !already_warned) {
                    console.warn("Multuple background-primary elements with different gradients have been detected. The gradient of the first element will be used and all subsequent elements will be overidden.");
                    already_warned = true;
                    getComputedStyle(child).backgroundImage = old_grad;
                }

                // remember the gradient
                old_grad = getComputedStyle(child).backgroundImage;
            }

            // this iteration only looks at background-primary elements. background-secondary elements are looked at next loop.
        }

        // if old_grad is still null then no background-primary elements were found.
        // continue to the next background-placer element.
        if (!old_grad) {
            continue;
        }

        // loop over all background-secondary elements and set their gradients to old_grad.
        // set the opacity of all background-secondary elements to 1 (fully shown) so that the background-primary elements are hidden.
        // This lets us change them without it being seen.
        for (let j=0; j<element.children.length; j++) {
            var child = element.children[j];

            // if the child is a background-secondary then set its gradient.
            if (child.classList.contains("background-secondary")) {
                getComputedStyle(child).backgroundImage = old_grad;

                // remove the opacity-fade class so that we can instantly set the opacity to 1 (fully shown)
                child.classList.remove("opacity-fade");

                getComputedStyle(child).opacity = "1.0"; // This should be a string. I checked.

                // add the class back on so that we can fade it out.
                child.classList.add("opacity-fade");
            }
        }

        // generate a new gradient and apply it to all the background-primarys
        var new_grad;

        if (gradient) {
            new_grad = gradient;
        }
        else {
            new_grad = random_gradient();
        }

        for (let j=0; j<element.children.length; j++) {
            var child = element.children[j];

            if (child.classList.contains("background-primary")) {
                getComputedStyle(child).backgroundImage = new_grad;
            }
        }

        // fade out the background-secondarys
        for (let j=0; j<element.children.length; j++) {
            var child = element.children[j];

            if (child.classList.contains("background-secondary")) {
                getComputedStyle(child).opacity = "0.0"
            }
        }
    }
}

setInterval(next_gradient,2000);