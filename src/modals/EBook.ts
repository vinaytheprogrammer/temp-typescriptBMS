import { IBook } from './IBook.js';

export class EBook implements IBook {
  constructor(
    public title: string,
    public author: string,
    public genre: string,
    public isbn: number,
    public price: number | null,
    public pubDate: string,
    public fileSize: number,
    public format: string,
    public bookType: string = 'ebook'
  ) {}
}