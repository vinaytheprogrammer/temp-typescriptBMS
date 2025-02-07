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
    getSummary() {
        return `Magazine: ${this.title} (Issue ${this.issueNumber})`;
    }
}
