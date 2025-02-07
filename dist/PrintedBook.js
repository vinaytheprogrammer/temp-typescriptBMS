export class PrintedBook {
    constructor(title, author, genre, isbn, price, pubDate) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = pubDate;
    }
    getSummary() {
        return `Printed Book: ${this.title} by ${this.author}`;
    }
}
