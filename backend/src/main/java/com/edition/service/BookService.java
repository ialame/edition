package com.edition.service;

import com.edition.model.Book;
import com.edition.model.BookCategory;
import com.edition.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {
    
    private final BookRepository bookRepository;
    
    public List<Book> findAll() {
        return bookRepository.findAll();
    }
    
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }
    
    public List<Book> findByCategory(BookCategory category) {
        return bookRepository.findByCategory(category);
    }
    
    public List<Book> searchByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }
    
    public List<Book> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public Book save(Book book) {
        return bookRepository.save(book);
    }
    
    public Optional<Book> update(Long id, Book bookDetails) {
        return bookRepository.findById(id)
                .map(existingBook -> {
                    existingBook.setTitle(bookDetails.getTitle());
                    existingBook.setAuthor(bookDetails.getAuthor());
                    existingBook.setIsbn(bookDetails.getIsbn());
                    existingBook.setPrice(bookDetails.getPrice());
                    existingBook.setDescription(bookDetails.getDescription());
                    existingBook.setCoverUrl(bookDetails.getCoverUrl());
                    existingBook.setPublicationYear(bookDetails.getPublicationYear());
                    existingBook.setCategory(bookDetails.getCategory());
                    return bookRepository.save(existingBook);
                });
    }
    
    public boolean delete(Long id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean existsByIsbn(String isbn) {
        return bookRepository.existsByIsbn(isbn);
    }
}
