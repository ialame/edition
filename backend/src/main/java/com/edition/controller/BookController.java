package com.edition.controller;

import com.edition.model.Book;
import com.edition.model.BookCategory;
import com.edition.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {
    
    private final BookService bookService;
    
    @GetMapping
    public List<Book> getAllBooks(
            @RequestParam(required = false) BookCategory category,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String title) {
        
        if (category != null) {
            return bookService.findByCategory(category);
        }
        if (author != null && !author.isBlank()) {
            return bookService.searchByAuthor(author);
        }
        if (title != null && !title.isBlank()) {
            return bookService.searchByTitle(title);
        }
        
        return bookService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        return bookService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBook(@RequestBody @Valid Book book) {
        if (bookService.existsByIsbn(book.getIsbn())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Un livre avec cet ISBN existe déjà"));
        }
        
        Book savedBook = bookService.save(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBook(@PathVariable Long id, 
                                        @RequestBody @Valid Book book) {
        return bookService.update(id, book)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (bookService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
