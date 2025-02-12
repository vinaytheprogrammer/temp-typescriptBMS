import { IBook } from './IBook.js';

export class ResearchPaper implements IBook {
  constructor(
    public title: string,
    public author: string,
    public genre: string,
    public isbn: number,
    public price: number | null,
    public pubDate: string,
    public journal: string,
    public bookType: string = 'research paper'
  ) {}
}
