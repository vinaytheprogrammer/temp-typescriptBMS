// import { Base } from './Book.js'; // Add `.js` extension after compiling to JS
import { BookAgeCalculator } from '../BookAgeCalculator.js';
import { BookUtilities } from './BookUtilities.js';
export class BookDOM {
    constructor(bookManager) {
        var _a, _b;
        this.books = [];
        this.originalBooks = [];
        this.sortAscButton = document.getElementById('sortAsc');
        this.sortDescButton = document.getElementById('sortDesc');
        this.bookManager = bookManager;
        this.books = bookManager.getBooks();
        this.originalBooks = [...this.books];
        this.booksPerPage = 5;
        this.bookListDiv = document.getElementById('bookList') || null;
        this.bookCountDiv = document.getElementById('bookCount') || null;
        (_a = this.sortAscButton) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.sortBooks('asc'));
        (_b = this.sortDescButton) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.sortBooks('desc'));
        const formContainer = document.getElementById('formContainer');
        if (formContainer) {
            formContainer.addEventListener('click', (e) => {
                if (e.target && e.target.id === 'formContainer') {
                    BookDOM.closeForm();
                }
            });
        }
    }
    updateBookDisplay(books = this.books, currentPage = 1) {
        const totalBooks = books.length;
        const startIndex = (currentPage - 1) * this.booksPerPage;
        const endIndex = Math.min(startIndex + this.booksPerPage, totalBooks);
        if (this.bookCountDiv) {
            this.bookCountDiv.textContent = `Number of books: ${totalBooks}`;
        }
        if (this.bookListDiv) {
            this.bookListDiv.innerHTML = totalBooks === 0 ? 'No Results' : '';
        }
        if (totalBooks > 0 && this.bookListDiv) {
            const wrapper = document.createElement('div');
            wrapper.className = 'overflow-x-auto w-full';
            const table = document.createElement('table');
            table.className = 'min-w-full table-auto bg-white shadow-lg rounded-lg text-sm sm:text-base';
            table.innerHTML = `
            <thead class="bg-gray-200 text-left">
              <tr class="bg-gray-300 text-xs sm:text-sm uppercase tracking-wide text-gray-700">
                <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Title</th>
                <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Author</th>
                <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">ISBN</th>
                <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Publication Date</th>
                <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Genre</th>
                <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Age</th>
                <th class="px-1 py-1 sm:px-3 sm:py-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              ${books.slice(startIndex, endIndex).map(book => `
                <tr class="border-t border-gray-200 hover:bg-gray-100 text-xs sm:text-sm">
                  <td class="px-1 py-1 sm:px-3 sm:py-2 font-medium text-gray-700">${book.title}</td>
                  <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${book.author}</td>
                  <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${book.isbn}</td>
                  <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${book.pubDate}</td>
                  <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${book.genre}</td>
                  <td class="px-1 py-1 sm:px-3 sm:py-2 text-gray-600">${BookAgeCalculator.calculateAge(book.pubDate)}</td>
                  <td class="px-1 py-1 sm:px-3 sm:py-2 text-green-600 font-semibold">${book.price}</td>
                </tr>
              `).join('')}
            </tbody>
          `;
            wrapper.appendChild(table);
            this.bookListDiv.appendChild(wrapper);
            if (totalBooks > this.booksPerPage) {
                this.addPaginationButtons(currentPage, Math.ceil(totalBooks / this.booksPerPage));
            }
        }
    }
    filterBooks() {
        var _a, _b, _c;
        const searchTerm = (_a = document.getElementById('searchTerm')) === null || _a === void 0 ? void 0 : _a.value.trim().toLowerCase();
        const filterGenre = (_b = document.getElementById('filterGenre')) === null || _b === void 0 ? void 0 : _b.value;
        const filterYear = (_c = document.getElementById('filterYear')) === null || _c === void 0 ? void 0 : _c.value;
        if (BookUtilities.validateTitle(searchTerm) === 'Special Characters not allowed')
            return;
        this.books = this.bookManager.filterBooks(searchTerm, filterGenre, filterYear);
        toastr.success('Filter applied successfully');
        this.updateBookDisplay(this.books);
    }
    resetFilters() {
        document.getElementById('searchTerm').value = '';
        document.getElementById('filterGenre').value = '';
        document.getElementById('filterYear').value = '';
        this.books = this.bookManager.getBooks();
        this.updateBookDisplay(this.books);
        toastr.success('Filters reset successfully.');
    }
}
