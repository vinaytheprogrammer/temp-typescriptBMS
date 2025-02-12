export class EBook {
    constructor(title, author, genre, isbn, price, pubDate, fileSize, format, bookType = 'ebook') {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = pubDate;
        this.fileSize = fileSize;
        this.format = format;
        this.bookType = bookType;
    }
}
