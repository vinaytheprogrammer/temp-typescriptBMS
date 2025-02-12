
import { BookUtilities } from './BookUtilities.js';
import { IBook2 } from '../modals/IBook2.js';
import { EBook } from '../modals/EBook.js';
import { PrintedBook } from '../modals/PrintedBook.js';

export class BookFormHandler {
    static getFormValues(fieldIds: string[]): Record<string, string | number> {
      const formData: Record<string, string | number> = {};
      fieldIds.forEach((id) => {
        const value = BookUtilities.getInputValue(id);
        formData[id] = isNaN(Number(value)) || value === '' ? value : Number(value);
      });
      return formData;
    }

    static createBookInstance(book: IBook2): IBook2 {
      switch (book.bookType) {
        case "ebook":
          return new EBook(
            book.title,
            book.author,
            book.genre,
            book.isbn,
            book.price,
            book.pubDate,
            (book as EBook).fileSize,
            (book as EBook).format
          );
  
        case "printed":
          return new PrintedBook(
            book.title,
            book.author,
            book.genre,
            book.isbn,
            book.price,
            book.pubDate,
            (book as PrintedBook).pages
          );
  
        
        default:
          throw new Error(`Unknown book type: ${book.bookType}`);
      }
    }

    
  }
  