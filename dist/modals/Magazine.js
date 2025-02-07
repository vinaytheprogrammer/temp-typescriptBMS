// export class Magazine implements IBook {
//   title: string;
//   author: string;
//   genre: string;
//   isbn: number;
//   price: number | null;
//   pubDate: string;
//   issueNumber: number;
//   constructor(title: string, author: string, genre: string, isbn: number, price: number | null, pubDate: string, issueNumber: number) {
//     this.title = title;
//     this.author = author;
//     this.genre = genre;
//     this.isbn = isbn;
//     this.price = price;
//     this.pubDate = pubDate;
//     this.issueNumber = issueNumber;
//   }
//   getSummary(): string {
//     return `Magazine: ${this.title} (Issue ${this.issueNumber})`;
//   }
// }
export class Magazine {
    constructor(title, author, genre, isbn, price, pubDate, issueNumber) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = pubDate;
        this.issueNumber = issueNumber;
    }
}
