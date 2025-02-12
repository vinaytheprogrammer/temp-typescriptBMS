import { IBook2 } from '../modals/IBook2.js';
import { BookUtilities } from './BookUtilities.js';
import { BookDOMe } from './BookDOMe.js';
import { EBook } from '../modals/EBook.js';
import { PrintedBook } from '../modals/PrintedBook.js';
import { BookFormHandler } from './BookFormHandler.js';

export class FetchBooks {
  private apiUrl: string = './books.json';
  private ebooks: EBook[] = [];
  private printedBooks: PrintedBook[] = [];
  private allBooks: IBook2[] = [];

  private ebookDOMe!: BookDOMe<EBook>;
  private printedBookDOMe!: BookDOMe<PrintedBook>;
  private allbookDOMe!: BookDOMe<IBook2>;
  private categorizedBookListDiv: HTMLElement | null = document.getElementById('bookList1');

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.fetchBooks();

    // Create separate DOM handlers for EBooks and PrintedBooks
    this.ebookDOMe = new BookDOMe<EBook>(this.ebooks);
    this.printedBookDOMe = new BookDOMe<PrintedBook>(this.printedBooks);
    
    document
    .querySelector('#categorizeBooksForm button')
    ?.addEventListener('click', () => this.allbookDOMe.handleCategorize(this.categorizedBookListDiv));
    document
    .getElementById('remove')
    ?.addEventListener('click', () => this.allbookDOMe.removeCategorizedBooks(this.categorizedBookListDiv));
  }

  private async fetchBooks(): Promise<void> {
    BookUtilities.showLoader('Fetching books...');
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const booksArray: IBook2[] = await response.json(); 

      // Separate books based on their type
      booksArray.forEach((book) => {
        if (book.bookType === 'ebook') {
          this.ebooks.push(BookFormHandler.createBookInstance(book) as EBook);
        } else if (book.bookType === 'printed') {
          this.printedBooks.push(BookFormHandler.createBookInstance(book) as PrintedBook);
        }
      });

      // Combine both ebooks and printedBooks into a single array
      this.allBooks = [...this.ebooks, ...this.printedBooks];
      this.allbookDOMe = new BookDOMe<IBook2>(this.allBooks);
      this.allbookDOMe.updateBookDisplay(this.allBooks, 1, 'allBooks');
      // Update the book displays after fetching and categorizing the books
     
      console.log(this.ebooks, this.printedBooks);
      toastr.success('Books fetched successfully');
    } catch (error) {
      toastr.error(`Error fetching books: ${error}`);
    } finally {
      BookUtilities.hideLoader();
    }
  }

  public getEBooks(): EBook[] {
    return this.ebooks;
  }

  public getPrintedBooks(): PrintedBook[] {
    return this.printedBooks;
  }

  public getEBookDOMe(): BookDOMe<EBook> {
    return this.ebookDOMe;
  }

  public getPrintedBookDOMe(): BookDOMe<PrintedBook> {
    return this.printedBookDOMe;
  }

  public getAllBooks(): IBook2[] {
    return this.allBooks;
  }

  public getAllBookDOMe(): BookDOMe<IBook2> {
    return this.allbookDOMe;
  }
}
