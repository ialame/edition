package com.edition.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 2, max = 200, message = "Le titre doit avoir entre 2 et 200 caractères")
    private String title;
    
    @NotBlank(message = "L'auteur est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom de l'auteur doit avoir entre 2 et 100 caractères")
    private String author;
    
    @NotBlank(message = "L'ISBN est obligatoire")
    @Pattern(regexp = "^978-\\d{10}$", message = "Format ISBN invalide (ex: 978-2070360024)")
    @Column(unique = true)
    private String isbn;
    
    @NotNull(message = "Le prix est obligatoire")
    @Min(value = 0, message = "Le prix doit être positif")
    private Double price;
    
    @Column(length = 1000)
    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    private String description;
    
    private String coverUrl;
    
    @Min(value = 1450, message = "L'année de publication doit être supérieure à 1450")
    @Max(value = 2100, message = "L'année de publication invalide")
    private Integer publicationYear;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "La catégorie est obligatoire")
    private BookCategory category;
}
