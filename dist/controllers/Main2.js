import { EBookManager } from './EBookManager.js';
import { PrintedBookManager } from "./PrintedBookManager.js";
import { FetchBooks } from './FetchBooks.js';
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c;
    const sortAscButton = document.getElementById("sortAsc");
    const sortDescButton = document.getElementById("sortDesc");
    const categorizedBookListDiv = document.getElementById('bookList1');
    const fetchobj = new FetchBooks(); // has-a relationship with BookManager
    let eBooks = fetchobj.getEBooks();
    let printedBooks = fetchobj.getPrintedBooks();
    let allBooks;
    let allBooksDOM = fetchobj.getAllBookDOMe();
    let eBooksDOM = fetchobj.getEBookDOMe();
    let printedBooksDOM = fetchobj.getPrintedBookDOMe();
    //first loaded functionality callings
    sortAscButton === null || sortAscButton === void 0 ? void 0 : sortAscButton.addEventListener("click", () => allBooksDOM.sortBooks(fetchobj.getAllBooks(), "asc", 'allBooks'));
    sortDescButton === null || sortDescButton === void 0 ? void 0 : sortDescButton.addEventListener("click", () => allBooksDOM.sortBooks(fetchobj.getAllBooks(), "desc", 'allBooks'));
    (_a = document.getElementById('applyFilters')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        fetchobj.getAllBookDOMe().filterBooks();
        const Sortedbooks = fetchobj.getAllBookDOMe().getBooks();
        sortAscButton === null || sortAscButton === void 0 ? void 0 : sortAscButton.addEventListener("click", () => allBooksDOM.sortBooks(Sortedbooks, "asc", 'FilterBooks'));
        sortDescButton === null || sortDescButton === void 0 ? void 0 : sortDescButton.addEventListener("click", () => allBooksDOM.sortBooks(Sortedbooks, "desc", 'FilterBooks'));
    });
    (_b = document.getElementById('resetFilters')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => fetchobj.getAllBookDOMe().resetFilters());
    //it will help us to show the form when we click on the add, edit, delete and categorize button
    window.showForm = (formId) => {
        var _a;
        const formContainer = document.getElementById('formContainer');
        if (formContainer) {
            formContainer.classList.remove('hidden');
            document.querySelectorAll('#formContainer > div').forEach((div) => div.classList.add('hidden'));
            (_a = document.getElementById(formId)) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        }
    };
    // Define toggleBookTypeFields at the global scope
    window.toggleBookTypeFields = () => {
        const bookType = document.getElementById('bookType').value;
        if (bookType === 'ebook') {
            $('#ebookFields').removeClass('hidden');
            $('#printedFields').addClass('hidden');
        }
        else if (bookType === 'printed') {
            $('#printedFields').removeClass('hidden');
            $('#ebookFields').addClass('hidden');
        }
        else {
            $('#ebookFields, #printedFields').addClass('hidden');
        }
    };
    // **Handle Add Book Form Submission**
    (_c = document.getElementById('addBookForm')) === null || _c === void 0 ? void 0 : _c.addEventListener('submit', (event) => {
        var _a, _b, _c, _d;
        event.preventDefault();
        // Get the selected book type
        const bookType = document.getElementById('bookType').value;
        // Instantiate the appropriate manager
        if (bookType === 'ebook') {
            const ebookManager = new EBookManager(fetchobj.getEBooks(), fetchobj.getEBookDOMe());
            ebookManager.addBook(event);
            // after adding the book, below functionalities will be work
            eBooks = [...ebookManager.getBooks()];
            sortAscButton === null || sortAscButton === void 0 ? void 0 : sortAscButton.addEventListener("click", () => eBooksDOM.sortBooks(fetchobj.getEBooks(), "asc"));
            sortDescButton === null || sortDescButton === void 0 ? void 0 : sortDescButton.addEventListener("click", () => eBooksDOM.sortBooks(fetchobj.getEBooks(), "desc"));
            (_a = document.querySelector('#deleteBookForm button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => ebookManager.handleDelete());
            (_b = document.querySelector('#editBookForm button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', ebookManager.handleEdit.bind(this));
        }
        else if (bookType === 'printed') {
            const printedbookManager = new PrintedBookManager(fetchobj.getPrintedBooks(), fetchobj.getPrintedBookDOMe());
            printedbookManager.addBook(event);
            // after adding the book, below functionalities will be work
            printedBooks = [...printedbookManager.getBooks()];
            sortAscButton === null || sortAscButton === void 0 ? void 0 : sortAscButton.addEventListener("click", () => printedBooksDOM.sortBooks(fetchobj.getPrintedBooks(), "asc"));
            sortDescButton === null || sortDescButton === void 0 ? void 0 : sortDescButton.addEventListener("click", () => printedBooksDOM.sortBooks(fetchobj.getPrintedBooks(), "desc"));
            (_c = document.querySelector('#deleteBookForm button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => printedbookManager.handleDelete());
            (_d = document.querySelector('#editBookForm button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', printedbookManager.handleEdit.bind(this));
        }
        else {
            console.error('Invalid book type selected.');
            return;
        }
    });
    const loadBookDetailsButton = document.getElementById("loadBookDetails");
    const editButton = document.getElementById("edit");
    let selectedBook = null;
    // **Load Book Details & Determine BType**
    loadBookDetailsButton.addEventListener("click", (event) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        event.preventDefault();
        const books = fetchobj.getAllBooks();
        const editIsbn = (_a = document.getElementById("editIsbn")) === null || _a === void 0 ? void 0 : _a.value.trim();
        selectedBook = (_b = books.find(b => b.isbn.toString() === editIsbn)) !== null && _b !== void 0 ? _b : null;
        if (!selectedBook) {
            toastr.error("Book not found. Please check the ISBN.");
            return;
        }
        (_c = document.getElementById("editFields")) === null || _c === void 0 ? void 0 : _c.classList.remove("hidden");
        // Fill the form with existing book details
        document.getElementById("newTitle").value = selectedBook.title;
        document.getElementById("newAuthor").value = selectedBook.author;
        document.getElementById("newPrice").value = ((_d = selectedBook.price) === null || _d === void 0 ? void 0 : _d.toString()) || "";
        document.getElementById("newPubDate").value = selectedBook.pubDate;
        document.getElementById("newGenre").value = selectedBook.genre;
        document.getElementById("BType").value = selectedBook.bookType;
        // Show correct fields based on book type
        if (selectedBook.bookType === "ebook") {
            (_e = document.getElementById("ebookEditFields")) === null || _e === void 0 ? void 0 : _e.classList.remove("hidden");
            (_f = document.getElementById("printedEditFields")) === null || _f === void 0 ? void 0 : _f.classList.add("hidden");
            document.getElementById("newFileSize").value = selectedBook.fileSize.toString();
            document.getElementById("newFormat").value = selectedBook.format;
        }
        else if (selectedBook.bookType === "printed") {
            (_g = document.getElementById("printedEditFields")) === null || _g === void 0 ? void 0 : _g.classList.remove("hidden");
            (_h = document.getElementById("ebookEditFields")) === null || _h === void 0 ? void 0 : _h.classList.add("hidden");
            document.getElementById("newPages").value = selectedBook.pages.toString();
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
        let manager;
        if (bookType === "ebook") {
            manager = new EBookManager(fetchobj.getEBooks(), fetchobj.getEBookDOMe());
        }
        else if (bookType === "printed") {
            manager = new PrintedBookManager(fetchobj.getPrintedBooks(), fetchobj.getPrintedBookDOMe());
        }
        else {
            toastr.error("Invalid book type.");
            return;
        }
        manager.handleEdit();
    });
    // **Handle Delete Book**
    const deleteIsbnInput = document.getElementById("deleteIsbn");
    const deleteBTypeInput = document.getElementById("deleteBType");
    const bookTypeContainer = document.getElementById("bookTypeContainer");
    const deleteButton = document.getElementById("deleteBookButton");
    // *Load Book Type when ISBN is entered**
    deleteIsbnInput.addEventListener("input", () => {
        const books = fetchobj.getAllBooks();
        const isbn = deleteIsbnInput.value.trim();
        const book = books.find(b => b.isbn.toString() === isbn);
        if (book) {
            deleteBTypeInput.value = book.bookType;
            bookTypeContainer.classList.remove("hidden");
        }
        else {
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
        }
        else if (BType === 'printed') {
            const printedBookManager = new PrintedBookManager(fetchobj.getPrintedBooks(), fetchobj.getPrintedBookDOMe());
            printedBookManager.handleDelete();
        }
        else {
            toastr.error("Unknown book type. Cannot delete.");
            return;
        }
    });
    // **Render All Books**
    window.renderAllBooks = () => {
        var _a, _b;
        // allBooks = fetchobj.getAllBooks();
        allBooks = [...eBooks, ...printedBooks];
        allBooksDOM = fetchobj.getAllBookDOMe();
        allBooksDOM.updateBookDisplay(allBooks, 1, 'allBooks');
        sortAscButton === null || sortAscButton === void 0 ? void 0 : sortAscButton.addEventListener("click", () => allBooksDOM.sortBooks(allBooks, "asc", 'allBooks'));
        sortDescButton === null || sortDescButton === void 0 ? void 0 : sortDescButton.addEventListener("click", () => allBooksDOM.sortBooks(allBooks, "desc", 'allBooks'));
        (_a = document.getElementById('applyFilters')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => allBooksDOM.filterBooks());
        (_b = document.getElementById('resetFilters')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => allBooksDOM.resetFilters());
    };
    // **Render EBooks**
    window.renderEBooks = () => {
        var _a, _b, _c, _d;
        //  eBooks = fetchobj.getEBooks();
        eBooksDOM = fetchobj.getEBookDOMe();
        eBooksDOM.updateBookDisplay(eBooks);
        sortAscButton === null || sortAscButton === void 0 ? void 0 : sortAscButton.addEventListener("click", () => eBooksDOM.sortBooks(eBooks, "asc"));
        sortDescButton === null || sortDescButton === void 0 ? void 0 : sortDescButton.addEventListener("click", () => eBooksDOM.sortBooks(eBooks, "desc"));
        (_a = document.querySelector('#categorizeBooksForm button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => eBooksDOM.handleCategorize(categorizedBookListDiv));
        (_b = document.getElementById('remove')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => eBooksDOM.removeCategorizedBooks(categorizedBookListDiv));
        (_c = document.getElementById('applyFilters')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => eBooksDOM.filterBooks());
        (_d = document.getElementById('resetFilters')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => eBooksDOM.resetFilters());
    };
    // **Render Printed Books**
    window.renderPrintedBooks = () => {
        var _a, _b, _c, _d;
        //  printedBooks = fetchobj.getPrintedBooks();
        printedBooksDOM = fetchobj.getPrintedBookDOMe();
        printedBooksDOM.updateBookDisplay(printedBooks);
        sortAscButton === null || sortAscButton === void 0 ? void 0 : sortAscButton.addEventListener("click", () => printedBooksDOM.sortBooks(printedBooks, "asc"));
        sortDescButton === null || sortDescButton === void 0 ? void 0 : sortDescButton.addEventListener("click", () => printedBooksDOM.sortBooks(printedBooks, "desc"));
        (_a = document.querySelector('#categorizeBooksForm button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => printedBooksDOM.handleCategorize(categorizedBookListDiv));
        (_b = document.getElementById('remove')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => printedBooksDOM.removeCategorizedBooks(categorizedBookListDiv));
        (_c = document.getElementById('applyFilters')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => printedBooksDOM.filterBooks());
        (_d = document.getElementById('resetFilters')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => printedBooksDOM.resetFilters());
    };
});
