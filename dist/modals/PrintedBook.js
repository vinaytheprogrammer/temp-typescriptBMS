// export class PrintedBook implements IBook {
//   title: string;
//   author: string;
//   genre: string;
//   isbn: number;
//   price: number | null;
//   pubDate: string;
//   constructor(title: string, author: string, genre: string, isbn: number, price: number | null, pubDate: string) {
//     this.title = title;
//     this.author = author;
//     this.genre = genre;
//     this.isbn = isbn;
//     this.price = price;
//     this.pubDate = pubDate;
//   }
//   getSummary(): string {
//     return `Printed Book: ${this.title} by ${this.author}`;
//   }
// }
export class PrintedBook {
    constructor(title, author, genre, isbn, price, pubDate, pages) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = pubDate;
        this.pages = pages;
    }
}
