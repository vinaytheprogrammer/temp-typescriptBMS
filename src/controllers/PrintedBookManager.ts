import { BookManagerG } from './BookManagerG.js';
import { PrintedBook } from '../modals/PrintedBook.js';
import { BookDOMe } from './BookDOMe.js';

export class PrintedBookManager extends BookManagerG<PrintedBook> {
  constructor(protected books: PrintedBook[], protected bookDOMe: BookDOMe<PrintedBook>) {
    super(books, bookDOMe);
    this.attachEventListeners();
  }
}
