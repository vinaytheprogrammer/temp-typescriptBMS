export class ResearchPaper {
    constructor(title, author, genre, isbn, price, pubDate, journal, bookType = 'research paper') {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = pubDate;
        this.journal = journal;
        this.bookType = bookType;
    }
}
