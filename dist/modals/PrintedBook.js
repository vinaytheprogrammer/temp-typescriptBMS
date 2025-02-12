export class PrintedBook {
    constructor(title, author, genre, isbn, price, pubDate, pages, bookType = 'printed') {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = pubDate;
        this.pages = pages;
        this.bookType = bookType;
    }
}
