export class BookAgeCalculator {
    static calculateAge(pubDate) {
        return new Date().getFullYear() - new Date(pubDate).getFullYear();
    }
}
