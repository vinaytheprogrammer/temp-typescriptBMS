import { IBook } from './IBook.js';

export class PrintedBook implements IBook {
  constructor(
    public title: string,
    public author: string,
    public genre: string,
    public isbn: number,
    public price: number | null,
    public pubDate: string,
    public pages: number,
    public bookType: string = 'printed'
  ) {}
}