import { BookManagerG } from './BookManagerG.js';
import { EBookManager } from './EBookManager.js';
import { PrintedBookManager } from "./PrintedBookManager.js";
import { IBook2 } from '../modals/IBook2.js';
import { FetchBooks } from './FetchBooks.js';
import { EBook } from '../modals/EBook.js';
import { PrintedBook } from '../modals/PrintedBook.js';
import { BookDOMe } from './BookDOMe.js';
import { BookFormHandler } from './BookFormHandler.js';

document.addEventListener('DOMContentLoaded', () => {
  const sortAscButton: HTMLElement | null = document.getElementById("sortAsc");
  const sortDescButton: HTMLElement | null = document.getElementById("sortDesc");
  const categorizedBookListDiv: HTMLElement | null = document.getElementById('bookList1');
 
  const fetchobj = new FetchBooks(); // has-a relationship with BookManager
 
  let eBooks : EBook[] = fetchobj.getEBooks(); 
  let printedBooks : PrintedBook[] = fetchobj.getPrintedBooks(); 
  let allBooks : IBook2[] ;
  let allBooksDOM = fetchobj.getAllBookDOMe();
  let eBooksDOM = fetchobj.getEBookDOMe();
  let printedBooksDOM = fetchobj.getPrintedBookDOMe();
  
  //first loaded functionality callings
  sortAscButton?.addEventListener("click", () => allBooksDOM.sortBooks(fetchobj.getAllBooks(), "asc",'allBooks'));
  sortDescButton?.addEventListener("click", () => allBooksDOM.sortBooks(fetchobj.getAllBooks(), "desc",'allBooks'));
  document.getElementById('applyFilters')?.addEventListener('click', () =>{ 
    fetchobj.getAllBookDOMe().filterBooks();
    const Sortedbooks = fetchobj.getAllBookDOMe().getBooks();
    sortAscButton?.addEventListener("click", () => allBooksDOM.sortBooks(Sortedbooks, "asc",'FilterBooks'));
    sortDescButton?.addEventListener("click", () => allBooksDOM.sortBooks(Sortedbooks, "desc",'FilterBooks'));     
  });
  document.getElementById('resetFilters')?.addEventListener('click', () => fetchobj.getAllBookDOMe().resetFilters());

  //it will help us to show the form when we click on the add, edit, delete and categorize button
  (window as any).showForm = (formId: string) => {
    const formContainer = document.getElementById('formContainer');
    if (formContainer) {
      formContainer.classList.remove('hidden');
      document.querySelectorAll('#formContainer > div').forEach((div) => div.classList.add('hidden'));
      document.getElementById(formId)?.classList.remove('hidden');
    }
  };
  
  // Define toggleBookTypeFields at the global scope
  (window as any).toggleBookTypeFields = () => {
    const bookType = (document.getElementById('bookType') as HTMLInputElement).value;

    if (bookType === 'ebook') {
      $('#ebookFields').removeClass('hidden');
      $('#printedFields').addClass('hidden');
    } else if (bookType === 'printed') {
      $('#printedFields').removeClass('hidden');
      $('#ebookFields').addClass('hidden');
    } else {
      $('#ebookFields, #printedFields').addClass('hidden');
    }
  };

  // **Handle Add Book Form Submission**
  document.getElementById('addBookForm')?.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the selected book type
    const bookType = (document.getElementById('bookType') as HTMLInputElement).value;

    // Instantiate the appropriate manager
    if (bookType === 'ebook') {

      const ebookManager = new EBookManager(fetchobj.getEBooks(), fetchobj.getEBookDOMe());
      ebookManager.addBook(event);
      // after adding the book, below functionalities will be work

      eBooks = [ ...ebookManager.getBooks()];
      sortAscButton?.addEventListener("click", () => eBooksDOM.sortBooks(fetchobj.getEBooks(), "asc"));
      sortDescButton?.addEventListener("click", () => eBooksDOM.sortBooks(fetchobj.getEBooks(), "desc"));
      document.querySelector('#deleteBookForm button')?.addEventListener('click', () => ebookManager.handleDelete());
      document.querySelector('#editBookForm button')?.addEventListener('click', ebookManager.handleEdit.bind(this));
    } else if (bookType === 'printed') {

      const printedbookManager = new PrintedBookManager(fetchobj.getPrintedBooks(), fetchobj.getPrintedBookDOMe());
      printedbookManager.addBook(event);
      // after adding the book, below functionalities will be work

      printedBooks = [ ...printedbookManager.getBooks()];
      sortAscButton?.addEventListener("click", () => printedBooksDOM.sortBooks(fetchobj.getPrintedBooks(), "asc"));
      sortDescButton?.addEventListener("click", () => printedBooksDOM.sortBooks(fetchobj.getPrintedBooks(), "desc"));
      document.querySelector('#deleteBookForm button')?.addEventListener('click', () => printedbookManager.handleDelete()); 
      document.querySelector('#editBookForm button')?.addEventListener('click', printedbookManager.handleEdit.bind(this));
    } else {
      console.error('Invalid book type selected.');
      return;
    }
  });

  const loadBookDetailsButton = document.getElementById("loadBookDetails") as HTMLButtonElement;
  const editButton = document.getElementById("edit") as HTMLButtonElement;

  let selectedBook: IBook2 | null = null;

  // **Load Book Details & Determine BType**
  loadBookDetailsButton.addEventListener("click", (event) => {
    event.preventDefault();

    const books = fetchobj.getAllBooks();
    const editIsbn = (document.getElementById("editIsbn") as HTMLInputElement)?.value.trim();
    selectedBook = books.find(b => b.isbn.toString() === editIsbn) ?? null;

    if (!selectedBook) {
      toastr.error("Book not found. Please check the ISBN.");
      return;
    }

    document.getElementById("editFields")?.classList.remove("hidden");

    // Fill the form with existing book details
    (document.getElementById("newTitle") as HTMLInputElement).value = selectedBook.title;
    (document.getElementById("newAuthor") as HTMLInputElement).value = selectedBook.author;
    (document.getElementById("newPrice") as HTMLInputElement).value = selectedBook.price?.toString() || "";
    (document.getElementById("newPubDate") as HTMLInputElement).value = selectedBook.pubDate;
    (document.getElementById("newGenre") as HTMLSelectElement).value = selectedBook.genre;
    (document.getElementById("BType") as HTMLInputElement).value = selectedBook.bookType;

    // Show correct fields based on book type
    if (selectedBook.bookType === "ebook") {
      document.getElementById("ebookEditFields")?.classList.remove("hidden");
      document.getElementById("printedEditFields")?.classList.add("hidden");

      (document.getElementById("newFileSize") as HTMLInputElement).value = (selectedBook as EBook).fileSize.toString();
      (document.getElementById("newFormat") as HTMLInputElement).value = (selectedBook as EBook).format;
    } else if (selectedBook.bookType === "printed") {
      document.getElementById("printedEditFields")?.classList.remove("hidden");
      document.getElementById("ebookEditFields")?.classList.add("hidden");

      (document.getElementById("newPages") as HTMLInputElement).value = (selectedBook as PrintedBook).pages.toString();
    }
  });

  // **Handle Edit Submission & Call Correct Class**
  editButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (!selectedBook) {
      toastr.error("No book selected for editing.");
      return;
    }

    const bookType = selectedBook.bookType;
    let manager: BookManagerG<IBook2>;

    if (bookType === "ebook") {
      manager = new EBookManager(fetchobj.getEBooks(), fetchobj.getEBookDOMe());
    } else if (bookType === "printed") {
      manager = new PrintedBookManager(fetchobj.getPrintedBooks(), fetchobj.getPrintedBookDOMe());
    } else {
      toastr.error("Invalid book type.");
      return;
    }

    manager.handleEdit();
  });

  // **Handle Delete Book**
const deleteIsbnInput = document.getElementById("deleteIsbn") as HTMLInputElement;
const deleteBTypeInput = document.getElementById("deleteBType") as HTMLInputElement;
const bookTypeContainer = document.getElementById("bookTypeContainer") as HTMLDivElement;
const deleteButton = document.getElementById("deleteBookButton") as HTMLButtonElement;

// *Load Book Type when ISBN is entered**
deleteIsbnInput.addEventListener("input", () => {
  const books = fetchobj.getAllBooks();
  const isbn = deleteIsbnInput.value.trim();
  const book = books.find(b => b.isbn.toString() === isbn);

  if (book) {
    deleteBTypeInput.value = book.bookType;
    bookTypeContainer.classList.remove("hidden");
  } else {
    deleteBTypeInput.value = "";
    bookTypeContainer.classList.add("hidden");
  }
});

// **Delete Book Based on BType**
deleteButton.addEventListener("click", (event) => {
  event.preventDefault();
  
  const isbn = deleteIsbnInput.value.trim();
  if (!isbn) {
    toastr.error("Please enter a valid ISBN.");
    return;
  }

  const books = fetchobj.getAllBooks();
  const book = books.find(b => b.isbn.toString() === isbn);

  if (!book) {
    toastr.error("Book not found. Please check the ISBN.");
    return;
  }

  const BType = book.bookType;

  // Call the appropriate manager based on BType
  if (BType === 'ebook') {
    const ebookManager = new EBookManager(fetchobj.getEBooks(), fetchobj.getEBookDOMe());
    ebookManager.handleDelete();
  } else if (BType === 'printed') {
    const printedBookManager = new PrintedBookManager(fetchobj.getPrintedBooks(), fetchobj.getPrintedBookDOMe());
    printedBookManager.handleDelete();
  } else {
    toastr.error("Unknown book type. Cannot delete.");
    return;
  }
});

  // **Render All Books**
  (window as any).renderAllBooks = () => {
    // allBooks = fetchobj.getAllBooks();
    allBooks = [...eBooks, ...printedBooks];
    allBooksDOM = fetchobj.getAllBookDOMe();
    allBooksDOM.updateBookDisplay(allBooks, 1, 'allBooks');
    sortAscButton?.addEventListener("click", () => allBooksDOM.sortBooks(allBooks, "asc",'allBooks'));
    sortDescButton?.addEventListener("click", () => allBooksDOM.sortBooks(allBooks, "desc",'allBooks'));
    document.getElementById('applyFilters')?.addEventListener('click', () => allBooksDOM.filterBooks());
    document.getElementById('resetFilters')?.addEventListener('click', () => allBooksDOM.resetFilters());
  };

  // **Render EBooks**
  (window as any).renderEBooks = () => {
    //  eBooks = fetchobj.getEBooks();
     eBooksDOM = fetchobj.getEBookDOMe();
    eBooksDOM.updateBookDisplay(eBooks);
    sortAscButton?.addEventListener("click", () => eBooksDOM.sortBooks(eBooks, "asc"));
    sortDescButton?.addEventListener("click", () => eBooksDOM.sortBooks(eBooks, "desc"));
    document.querySelector('#categorizeBooksForm button')?.addEventListener('click', () => eBooksDOM.handleCategorize(categorizedBookListDiv));
    document.getElementById('remove')?.addEventListener('click', () => eBooksDOM.removeCategorizedBooks(categorizedBookListDiv));
    document.getElementById('applyFilters')?.addEventListener('click', () => eBooksDOM.filterBooks());
    document.getElementById('resetFilters')?.addEventListener('click', () => eBooksDOM.resetFilters());
  };

  // **Render Printed Books**
  (window as any).renderPrintedBooks = () => {
    //  printedBooks = fetchobj.getPrintedBooks();
    printedBooksDOM = fetchobj.getPrintedBookDOMe();
    printedBooksDOM.updateBookDisplay(printedBooks);
    sortAscButton?.addEventListener("click", () => printedBooksDOM.sortBooks(printedBooks, "asc"));
    sortDescButton?.addEventListener("click", () => printedBooksDOM.sortBooks(printedBooks, "desc"));
    document.querySelector('#categorizeBooksForm button')?.addEventListener('click', () => printedBooksDOM.handleCategorize(categorizedBookListDiv));
    document.getElementById('remove')?.addEventListener('click', () => printedBooksDOM.removeCategorizedBooks(categorizedBookListDiv));
    document.getElementById('applyFilters')?.addEventListener('click', () => printedBooksDOM.filterBooks());
    document.getElementById('resetFilters')?.addEventListener('click', () => printedBooksDOM.resetFilters());
  };
});
