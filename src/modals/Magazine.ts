import { IBook } from './IBook.js';

export class Magazine implements IBook {
  constructor(
    public title: string,
    public author: string,
    public genre: string,
    public isbn: number,
    public price: number | null,
    public pubDate: string,
    public issueNumber: number,
    public bookType: string = 'Magazine'
  ) {}
}