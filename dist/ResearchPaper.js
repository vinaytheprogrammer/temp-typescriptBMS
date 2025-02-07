export class ResearchPaper {
    constructor(title, author, genre, isbn, price, pubDate, citationCount) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = pubDate;
        this.citationCount = citationCount;
    }
    getSummary() {
        return `Research Paper: ${this.title} (Citations: ${this.citationCount})`;
    }
}
