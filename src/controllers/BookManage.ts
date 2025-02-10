import { IBook } from '../modals/IBook';
import { BookUtilities } from './BookUtilities.js';
import { BookDOMe } from './BookDOMe.js';

export class BookManage<T extends IBook> {
  // T extends IBook means T can be any type that extends IBook
  private apiUrl: string = './books.json';
  private books: T[] = [];
  private form: HTMLFormElement | null;
  private categorizedBookListDiv: HTMLElement | null;
  private bookDOMe!: BookDOMe<T>;

  constructor() {
    this.form = document.querySelector('#addBookForm');
    this.categorizedBookListDiv = document.getElementById('bookList1');
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.fetchBooks();
    this.bookDOMe = new BookDOMe(this.books);
    this.bookDOMe.updateBookDisplay();
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    if (this.form) {
      document.getElementById('applyFilters')?.addEventListener('click', () => this.bookDOMe.filterBooks());
      document.getElementById('resetFilters')?.addEventListener('click', () => this.bookDOMe.resetFilters());
      this.form.addEventListener('submit', (event) => this.addBook(event));
      document
        .querySelector('#categorizeBooksForm button')
        ?.addEventListener('click', () => this.bookDOMe.handleCategorize(this.categorizedBookListDiv));
      document
        .getElementById('remove')
        ?.addEventListener('click', () => this.bookDOMe.removeCategorizedBooks(this.categorizedBookListDiv));
      document.querySelector('#editBookForm button')?.addEventListener('click', this.handleEdit.bind(this)); // bind helps to access the this keyword
      document.querySelector('#deleteBookForm button')?.addEventListener('click', () => this.handleDelete()); // no need to call using bind() in arrow function
    }
  }

  private async fetchBooks(): Promise<void> {
    BookUtilities.showLoader('Fetching books...');
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const booksObject: Record<string, T> = await response.json(); //
      this.books = Object.values(booksObject).map((book: T) => this.createBookInstance(book));
      toastr.success('Books fetched successfully');
    } catch (error) {
      toastr.error(`Error fetching books: ${error}`);
    } finally {
      BookUtilities.hideLoader();
    }
  }

  private createBookInstance(book: IBook): T {
    // Customize this method to return the correct instance type (EBook, PrintedBook, etc.)
    return book as T;
  }

  public addBook(event: Event): void {
    event.preventDefault(); // Prevent the default form submission

    const title = BookUtilities.getInputValue('title');
    const author = BookUtilities.getInputValue('author');
    const isbn = Number(BookUtilities.getInputValue('isbn'));
    const price = Number(BookUtilities.getInputValue('price'));
    const pubDate = BookUtilities.getInputValue('pub_date');
    const genre = BookUtilities.getInputValue('genre');
    const pages = Number(BookUtilities.getInputValue('pages')); // Optional if needed for PrintedBook

    // Validate the input
    if (
      !BookUtilities.isValidInput(title, author, isbn, price, pubDate) ||
      BookDOMe.isbnExists(this.books, isbn)
    ) {
      return;
    }

    // Create a new book instance based on a condition (e.g., genre/type)
    const book: T = this.createBookInstance({
      title,
      author,
      genre,
      isbn,
      price,
      pubDate
    });

    this.books.push(book);
    toastr.success(`${title} has been added.`);

    // Reset form fields
    BookUtilities.resetForm(['title', 'author', 'isbn', 'price', 'pub_date', 'genre', 'pages']);
    BookDOMe.closeForm();
    // Update the book display
    this.bookDOMe.updateBookDisplay(this.books);
  }

  // Handle Edit functionality
  public handleEdit(): void {
    const isbn = Number(BookUtilities.getInputValue('editIsbn'));
    const newTitle = BookUtilities.getInputValue('newTitle');
    const newAuthor = BookUtilities.getInputValue('newAuthor');
    const newPubDate = BookUtilities.getInputValue('newPubDate');
    const newGenre = BookUtilities.getInputValue('newGenre');
    const newPrice = Number(BookUtilities.getInputValue('newPrice'));

    const bookIndex = BookDOMe.findBookByIsbn(this.books, Number(isbn));
    if (bookIndex === -1) {
      return; // Book not found, already handled inside the method
    }
    //Validate the input
    if (
      !BookUtilities.isValidInput(newTitle, newAuthor, isbn, newPrice, newPubDate) ||
      BookDOMe.isbnExists(this.books, isbn)
    ) {
      return;
    }

    // Update the book's details
    if (newTitle) this.books[bookIndex].title = newTitle;
    if (newAuthor) this.books[bookIndex].author = newAuthor;
    if (newPubDate) this.books[bookIndex].pubDate = newPubDate;
    if (newGenre) this.books[bookIndex].genre = newGenre;
    if (newPrice) this.books[bookIndex].price = Number(newPrice);

    BookDOMe.closeForm();
    toastr.success('Book updated successfully.');

    // Reset form fields
    BookUtilities.resetForm([
      'newTitle',
      'newAuthor',
      'editIsbn',
      'newPrice',
      'newPubDate',
      'newGenre',
      'pages'
    ]);
    this.bookDOMe.updateBookDisplay(this.books);
  }

  // Handle Delete functionality
  public handleDelete(): void {
    const isbn = Number(BookUtilities.getInputValue('deleteIsbn'));
    if (BookUtilities.validateIsbn(isbn) === -1) return;

    const bookIndex = BookDOMe.findBookByIsbn(this.books, Number(isbn));
    if (bookIndex === -1) {
      return; // Book not found, already handled inside the method
    }

    BookDOMe.closeForm();
    this.books.splice(bookIndex, 1); // Remove the book from the books array
    toastr.success('Book deleted successfully.');
    BookUtilities.resetForm(['deleteIsbn']);
    this.bookDOMe.updateBookDisplay(this.books);
  }
}
