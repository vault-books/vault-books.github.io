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

function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}

function get_current_page_id() {
    return $('meta[name="page-id"]').attr("content");
}

function get_path_parts() {
    let path = window.location.pathname;
    let path_no_slash = path.startsWith("/") ? path.slice(1) : path;
    let path_parts = path_no_slash.split("/");
    return path_parts;
}

var current_gradient = random_gradient();
function next_gradient(gradient=null) {
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

var book_data
var books_loaded = false
async function loadBookList() {
    // Loads the books in `books.json` into the book list.
    try {
        // Load books.json
        let response = await fetch("books.json");
        book_data = await response.json();

        // Load and parse the book cover template
        let templateResponse = await fetch("templates.html");
        let templateString = await templateResponse.text();
        let templateDocument = new DOMParser().parseFromString(templateString, 'text/html');
        let bookTemplate = $(templateDocument.getElementById("cover-template").innerHTML);

        $(".cover-container").empty(); // Clear any loading text or other previous content.

        let count=0;
        book_data.books.forEach(book => {
            // Clone bookTemplate
            let bookElement = bookTemplate.clone();

            bookElement.find(".title").html(escapeHTML(book.title));
            bookElement.find(".author").html(escapeHTML(book.author));
            bookElement.find(".blurb").html(escapeHTML(book.blurb));
            bookElement.attr("id",`bookcover${count}`);

            bookElement.on("click", onBookClick.bind(null, count))

            $(".cover-container").append(bookElement);
            count++;
        })
    }
    catch (error) {
        console.error("Error loading the books: ",error)
    }
    books_loaded = true
}

function onBookClick(coverid) {
    alert(coverid)
    console.log(coverid)
    window.location.href = `${window.location.origin}/book?id=${coverid}`
}

async function main() {
    // Get the page id for the current page.
    let page_id = get_current_page_id();

    if (page_id=="index") {
        loadBookList();
        next_gradient();
    }
    else if (page_id=="book") {
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("id")) {
            // Load books.json
            let response = await fetch("books.json");
            book_data = await response.json();

            let data = book_data["books"][parseInt(urlParams.get("id"))]
            console.log("yeeting nopesups: ")
            console.log(data)
            // Inject the book contents into the page.
            $(".title").html(data["title"]);
            $(".author").html(data["author"]);
            $(".blurb").html(data["blurb"]);
            $(".content").html(data["content"]);
        }
        else {
            //TODO: add a URL parameter telling the 404 page why the book was not found
            // i.e. that the id did not exist as opposed to the page itself not existing.
            window.location.href = `${window.location.origin}/404.html`
        }
    }
}

function preLoad() {
    // Get the page id for the current page.
    let page_id = get_current_page_id();

    if (page_id=="404") {
        // Attempt to work out which page was the intended destination from the url.
        let path = get_path_parts();
        if ((path[0] == "book" && path.length == 2) || true) {
            if (/^[0-9]+$/.test(path[1]) || true) {
                let bookId = parseInt(path[1]);
                window.location.href = `${window.location.origin}/book.html?id=${bookId}`
            }
        }
    }
}

$(document).ready(main);

// preLoad(); // currently doesn't do anything worthwhile.