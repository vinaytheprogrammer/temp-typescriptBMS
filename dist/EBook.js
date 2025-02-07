export class EBook {
    constructor(title, author, genre, isbn, price, pubDate, fileSize) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = pubDate;
        this.fileSize = fileSize;
    }
    getSummary() {
        return `E-Book: ${this.title} by ${this.author} (File size: ${this.fileSize}MB)`;
    }
}
