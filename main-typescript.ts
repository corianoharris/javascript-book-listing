// see https://repl.it/@Dotdash/Goodreads-Server-Express for implementation details
// const apiUrl = `https://goodreads-server-express--dotdash.repl.co/search/${terms}`;

"use strict";

export {};

// access to elements

const searchInput: Element | null = document.getElementById("searchInput");
const searchButton: Element | null = document.getElementById("searchButton");
const resultsContainer: Element | null = document.getElementById("results");
const paginationContainer: Element | null =
  document.getElementById("pagination");
const loader: Element | null = document.getElementById("loader");

let currentPage: number = 1;
let totalPages: number = 0;

// clear search input field
const clearSearchInput = (strValue: string = " ") => {
  if (searchInput !== null) {
    (searchInput as HTMLInputElement).value = strValue;
  }
};

const searchBooks = () => {
  const terms: string = (searchInput as HTMLInputElement).value;

  // clear listings and pagination until results are loaded.
  (resultsContainer as HTMLDivElement).innerHTML = "";
  (paginationContainer as HTMLDivElement).innerHTML = "";

  if (terms.trim() === "") {
    return;
  }

  fetchBooks(terms);
  clearSearchInput();
};

// using async with try catch for api coverage
const fetchBooks = async (terms: string) => {
  const endpoint: string = `https://goodreads-server-express--dotdash.repl.co/search/${terms}`;

  /**
 * Request options but not needed:
 * const requestOptions = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
  };
*/

  try {
    let response: any;
    //basic loading message
    (loader as HTMLHeadingElement).innerHTML = "Loading Books...";
    response = await fetch(endpoint);
    (paginationContainer as HTMLDivElement).innerHTML = "";

    if (response.status === 200) {
      (loader as HTMLHeadingElement).innerHTML = "";
      let data: any = await response.json();
      console.log(data);
      displayResults(data);
      updatePagination(data);
    } else
      (resultsContainer as HTMLDivElement).innerHTML =
        "An error occurred while fetching data.";
  } catch (error) {
    console.error("Error:", error);
  }
};

const displayResults = (books: any) => {
  if (books.length === 0) {
    (resultsContainer as HTMLDivElement).innerHTML = "No books found.";
    return;
  }

  // decided to dynamic create book elements

  books.list.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const bookTextContentElement = document.createElement("div");
    bookTextContentElement.classList.add("book-text-content");

    const imgElement = document.createElement("img");
    imgElement.classList.add("book-img");
    imgElement.src = book.imageUrl;

    const titleElement = document.createElement("h4");
    titleElement.classList.add("book-title");
    titleElement.textContent = book.title;

    const authorElement = document.createElement("h5");
    authorElement.classList.add("book-author");
    authorElement.textContent = book.authorName;

    bookTextContentElement.appendChild(titleElement);
    bookTextContentElement.appendChild(authorElement);

    bookElement.appendChild(imgElement);
    bookElement.appendChild(bookTextContentElement);

    (resultsContainer as HTMLDivElement).appendChild(bookElement);
  });
};

// Pagination

const updatePagination = (pagination) => {
  if (pagination.list.length !== 0) {
    (
      paginationContainer as HTMLDivElement
    ).innerHTML = `${pagination.list.length} books`;
  }

  /**
   * default to 1 since api is returning array of only 20 items
   *  Could do pagination.total if more element were returned.
   */
  totalPages = 1;

  const previousButton = createPaginationButton(
    "Previous",
    currentPage > 1 ? currentPage - 1 : totalPages
  );
  (paginationContainer as HTMLDivElement).appendChild(previousButton);

  for (let i: number = 1; i <= totalPages; i++) {
    const pageButton = createPaginationButton(String(i), i);
    (paginationContainer as HTMLDivElement).appendChild(pageButton);
  }

  const nextButton = createPaginationButton(
    "Next",
    currentPage < totalPages ? currentPage + 1 : totalPages
  );
  (paginationContainer as HTMLDivElement).appendChild(nextButton);
};

const createPaginationButton = (label: string, pageNumber: number) => {
  const button = document.createElement("button");
  button.classList.add("pagination-button");
  button.textContent = label;

  button.addEventListener("click", () => {
    /**
     *  Added a Use Case:
     * If no next or previous page, disable previous and next buttons.
     *
     * */
    if (pageNumber === currentPage) {
      button.classList.add("current-page");
      button.classList.add("disabled");
    } else {
      button.classList.remove("disabled");
      fetchBooks((searchInput as HTMLInputElement).value);
    }
  });
  return button;
};

/**
 * Added two event listeners.  The reason I added a keyboard event listener was for user that preferred or need to use the keyboard.
 */

(searchButton as HTMLButtonElement).addEventListener(
  "click",
  searchBooks,
  false
);
(searchInput as HTMLInputElement).addEventListener(
  "keypress",
  function (event) {
    if (event.key === "Enter") {
      searchBooks();
    }
  },
  false
);

/**
 * Next phrase would be unit and intergration testing.
 */
