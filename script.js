function random_hex() {
    var return_value = "";
    var hex_values = "0123456789abcdef";

    for (let i=0; i < 6; i++) {
      return_value += hex_values.charAt(Math.floor(Math.random() * hex_values.length));
    }
    return return_value;
}

// let toggle=true;
function random_gradient() {
    // toggle = !toggle;
    // if (toggle) {
    //     return "linear-gradient(to top    left,  #00F, transparent)";
    // }
    // else {
    //     return "linear-gradient(to top    left,  #FFF, transparent)";
    // }
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

async function loadBooks() {
    try {
        // Load books.json
        let response = await fetch("books.json");
        let data = await response.json();
        let templateResponse = await fetch("templates.html");
        let templateString = await templateResponse.text();
        let templateDocument = new DOMParser().parseFromString(templateString, 'text/html');
        let bookTemplate = $(templateDocument.getElementById("cover-template").innerHTML);

        $(".cover-container").empty(); // Clear any loading text or other previous content.

        let count=0;
        data.books.forEach(book => {
            // Clone bookTemplate
            let bookElement = bookTemplate.clone();

            bookElement.find(".title").text(book.title);
            bookElement.find(".author").text(book.author);
            bookElement.find(".blurb").text(book.blurb);
            bookElement.attr("id",`bookcover${count}`);

            bookElement.on("click", onBookClick.bind(null, bookElement.id))

            $(".cover-container").append(bookElement);
        })
    }
    catch (error) {
        console.error("Error loading the books:",error)
    }
}

function onBookClick(coverid) {
    window.location.href = `${window.location.origin}/book.html`
}

// #endregion
$(document).ready(next_gradient);
$(document).ready(loadBooks);