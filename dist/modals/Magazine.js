export class Magazine {
    constructor(title, author, genre, isbn, price, pubDate, issueNumber, bookType = 'Magazine') {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = pubDate;
        this.issueNumber = issueNumber;
        this.bookType = bookType;
    }
}
