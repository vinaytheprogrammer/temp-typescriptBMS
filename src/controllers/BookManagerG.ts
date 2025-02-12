import { IBook2 } from '../modals/IBook2.js';
import { BookUtilities } from './BookUtilities.js';
import { BookDOMe } from './BookDOMe.js';
import { EBook } from '../modals/EBook.js';
import { PrintedBook } from '../modals/PrintedBook.js';
import {BookFormHandler} from './BookFormHandler.js';

export class BookManagerG<T extends IBook2> {
  protected books: T[] = [];
  protected bookDOMe: BookDOMe<T>;
  private form: HTMLFormElement | null;
  private categorizedBookListDiv: HTMLElement | null;


  constructor(books : T[], bookDOMe: BookDOMe<T>) {
    this.books = books;
    this.bookDOMe = bookDOMe;
    this.form = document.querySelector('#addBookForm');
    this.categorizedBookListDiv = document.getElementById('bookList1');
   
  }

  protected attachEventListeners(): void {
    if (this.form) {
      document.getElementById('applyFilters')?.addEventListener('click', () => this.bookDOMe.filterBooks());
      document.getElementById('resetFilters')?.addEventListener('click', () => this.bookDOMe.resetFilters());
      // this.form.addEventListener('submit', (event) => this.addBook(event));
      document
        .querySelector('#categorizeBooksForm button')
        ?.addEventListener('click', () => this.bookDOMe.handleCategorize(this.categorizedBookListDiv));
      document
        .getElementById('remove')
        ?.addEventListener('click', () => this.bookDOMe.removeCategorizedBooks(this.categorizedBookListDiv));
    }
  }

  public addBook(event: Event): void {
    event.preventDefault();

    const formData = BookFormHandler.getFormValues(['bookType', 'title', 'author', 'isbn', 'price', 'pub_date', 'genre']);
    if (
      !BookUtilities.isValidInput(formData.title as string, formData.author as string, formData.isbn as number, formData.price as number, formData.pub_date as string) ||
      BookUtilities.isbnExists(this.books, formData.isbn as number)
    ) {
      return;
    }

    let book: T;
    if (formData.bookType === 'ebook') {
      const fileSize = Number(BookUtilities.getInputValue('fileSize'));
      const format = BookUtilities.getInputValue('fileFormat');
      book = new EBook(
        formData.title as string, 
        formData.author as string, 
        formData.genre as string, 
        formData.isbn as number, 
        formData.price as number, 
        formData.pub_date as string, 
        fileSize, 
        format
      ) as unknown as T;
    } else if (formData.bookType === 'printed') {
      const pages = Number(BookUtilities.getInputValue('pageCount'));
      book = new PrintedBook(
        formData.title as string, 
        formData.author as string, 
        formData.genre as string, 
        formData.isbn as number, 
        formData.price as number, 
        formData.pub_date as string, 
        pages
      ) as unknown as T;
    } else {
      // toastr.error('Invalid book type.');
      return;
    }

    this.books.push(book);
    toastr.success(`${formData.title} has been added.`);

    BookUtilities.resetForm(['bookType', 'title', 'author', 'isbn', 'price', 'pub_date', 'genre', 'fileSize', 'fileFormat', 'pageCount']);
    BookDOMe.closeForm();
    console.log('asdfghjhgfdsasdf',this.books);
    this.bookDOMe.updateBookDisplay(this.books); 
  }

  // Handle Edit functionality
  public handleEdit(): void {
   
  const formData = BookFormHandler.getFormValues(['editIsbn', 'newTitle', 'newAuthor', 'newPubDate', 'newGenre', 'newPrice', 'newFileSize', 'newFileFormat', 'newPages']);
  
  const isbn = Number(formData.editIsbn);
  const bookIndex = BookUtilities.findBookByIsbn(this.books, isbn);

  if (
    !BookUtilities.isValidInput(
      formData.newTitle as string,
      formData.newAuthor as string,
      isbn,
      formData.newPrice as number,
      formData.newPubDate as string,
    )
  ) {
    return;
  }

  // Update the book's details
  if (formData.newTitle) this.books[bookIndex].title = formData.newTitle as string;
  if (formData.newAuthor) this.books[bookIndex].author = formData.newAuthor as string;
  if (formData.newPubDate) this.books[bookIndex].pubDate = formData.newPubDate as string;
  if (formData.newGenre) this.books[bookIndex].genre = formData.newGenre as string;
  if (formData.newPrice) this.books[bookIndex].price = formData.newPrice as number;
 if(formData.bookType === 'ebook') {
    if (formData.newFileSize) (this.books[bookIndex] as unknown as EBook).fileSize = Number(formData.newFileSize);
    if (formData.newFileFormat) (this.books[bookIndex] as unknown as EBook).format = formData.newFileFormat as string;
  } else if (formData.bookType === 'printed') { 
    if (formData.newPages) (this.books[bookIndex] as unknown as PrintedBook).pages = Number(formData.newPages);
  }

  BookDOMe.closeForm();
  toastr.success('Book updated successfully.');
  BookUtilities.resetForm(['newTitle', 'newAuthor', 'editIsbn', 'newPrice', 'newPubDate', 'newGenre']);
  this.bookDOMe.updateBookDisplay(this.books);
  }

  // Handle Delete functionality
  public handleDelete(): void {
    const isbn = Number(BookUtilities.getInputValue('deleteIsbn'));
    if (BookUtilities.validateIsbn(isbn) === -1) return;

    const bookIndex = BookUtilities.findBookByIsbn(this.books, Number(isbn));
    if (bookIndex === -1) {
      return; // Book not found, already handled inside the method
    }

    BookDOMe.closeForm();
    this.books.splice(bookIndex, 1); // Remove the book from the books array
    toastr.success('Book deleted successfully.');
    BookUtilities.resetForm(['deleteIsbn','deleteBType']);
    this.bookDOMe.updateBookDisplay(this.books);
  }

  public getBooks(): T[] {  
    return this.books;
  }
}