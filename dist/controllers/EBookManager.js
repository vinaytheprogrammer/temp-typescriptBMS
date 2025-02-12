import { BookManagerG } from './BookManagerG.js';
export class EBookManager extends BookManagerG {
    constructor(ebooks, bookDOMe) {
        super(ebooks, bookDOMe);
        this.ebooks = ebooks;
        this.bookDOMe = bookDOMe;
        this.attachEventListeners();
    }
}
