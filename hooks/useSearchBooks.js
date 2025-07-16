// hooks/useSearchBooks.js
import { useState, useEffect } from 'react';

export default function useSearchBooks(books) {
    const [search, setSearch] = useState('');
    const [filterGenre, setFilterGenre] = useState('');
    const [filteredBooks, setFilteredBooks] = useState(books);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const filtered = books
            .filter(
                (b) =>
                    b.titre.toLowerCase().includes(search.toLowerCase()) ||
                    b.auteur.toLowerCase().includes(search.toLowerCase())
            )
            .filter((b) => (filterGenre ? b.genre.toLowerCase().includes(filterGenre.toLowerCase()) : true))
            .filter((b) => (filterDate ? b.date_publication.includes(filterDate) : true));
        setFilteredBooks(filtered);
    }, [search, filterGenre, books]);

    return {
        search,
        setSearch,
        filterGenre,
        setFilterGenre,
        filterDate,
        setFilterDate,
        filteredBooks
    };
}
