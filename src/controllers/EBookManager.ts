import { BookManagerG } from './BookManagerG.js';
import { EBook } from '../modals/EBook.js';
import { BookDOMe } from './BookDOMe.js';

export class EBookManager extends BookManagerG<EBook> {
  constructor(protected ebooks: EBook[], protected bookDOMe: BookDOMe<EBook>) {
    super(ebooks, bookDOMe);
    this.attachEventListeners();
  }
}