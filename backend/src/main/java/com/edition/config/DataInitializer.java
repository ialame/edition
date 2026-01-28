package com.edition.config;

import com.edition.model.Book;
import com.edition.model.BookCategory;
import com.edition.repository.BookRepository;
import com.edition.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserService userService;
    private final BookRepository bookRepository;
    
    @Override
    public void run(String... args) {
        // Créer un utilisateur admin par défaut
        if (!userService.existsByUsername("admin")) {
            userService.createAdmin("admin", "admin123");
            System.out.println(">>> Utilisateur admin créé: admin / admin123");
        }
        
        // Créer un utilisateur normal
        if (!userService.existsByUsername("user")) {
            userService.createUser(new com.edition.dto.RegisterRequest("user", "user123"));
            System.out.println(">>> Utilisateur créé: user / user123");
        }
        
        // Ajouter quelques livres de démonstration
        if (bookRepository.count() == 0) {
            bookRepository.save(new Book(
                null,
                "Les Fleurs du Mal",
                "Charles Baudelaire",
                "978-2070360024",
                12.50,
                "Recueil de poèmes de Charles Baudelaire, englobant la quasi-totalité de sa production en vers.",
                "https://covers.openlibrary.org/b/isbn/978-2070360024-L.jpg",
                1857,
                BookCategory.POESIE
            ));
            
            bookRepository.save(new Book(
                null,
                "Le Petit Prince",
                "Antoine de Saint-Exupéry",
                "978-2070612758",
                8.90,
                "L'histoire d'un aviateur qui rencontre un petit prince venu d'une autre planète.",
                "https://covers.openlibrary.org/b/isbn/978-2070612758-L.jpg",
                1943,
                BookCategory.JEUNESSE
            ));
            
            bookRepository.save(new Book(
                null,
                "Germinal",
                "Émile Zola",
                "978-2070409099",
                9.40,
                "Roman dépeignant la vie des mineurs du Nord de la France au XIXe siècle.",
                "https://covers.openlibrary.org/b/isbn/978-2070409099-L.jpg",
                1885,
                BookCategory.ROMAN
            ));
            
            bookRepository.save(new Book(
                null,
                "Cyrano de Bergerac",
                "Edmond Rostand",
                "978-2070411030",
                6.90,
                "Pièce de théâtre en vers libres, représentée pour la première fois en 1897.",
                "https://covers.openlibrary.org/b/isbn/978-2070411030-L.jpg",
                1897,
                BookCategory.THEATRE
            ));
            
            bookRepository.save(new Book(
                null,
                "Les Misérables",
                "Victor Hugo",
                "978-2253004226",
                11.90,
                "Roman historique, social et philosophique dans lequel on suit le parcours de Jean Valjean.",
                "https://covers.openlibrary.org/b/isbn/978-2253004226-L.jpg",
                1862,
                BookCategory.ROMAN
            ));
            
            bookRepository.save(new Book(
                null,
                "L'Étranger",
                "Albert Camus",
                "978-2070360026",
                7.50,
                "Premier roman d'Albert Camus, paru en 1942, qui relate l'histoire de Meursault.",
                "https://covers.openlibrary.org/b/isbn/978-2070360026-L.jpg",
                1942,
                BookCategory.ROMAN
            ));
            
            bookRepository.save(new Book(
                null,
                "Essais",
                "Michel de Montaigne",
                "978-2070106875",
                15.00,
                "Œuvre majeure de Montaigne, composée de trois livres rédigés entre 1572 et 1592.",
                "https://covers.openlibrary.org/b/isbn/978-2070106875-L.jpg",
                1580,
                BookCategory.ESSAI
            ));
            
            bookRepository.save(new Book(
                null,
                "Mémoires d'Hadrien",
                "Marguerite Yourcenar",
                "978-2070402823",
                9.20,
                "Roman historique retraçant la vie de l'empereur romain Hadrien.",
                "https://covers.openlibrary.org/b/isbn/978-2070402823-L.jpg",
                1951,
                BookCategory.BIOGRAPHIE
            ));
            
            System.out.println(">>> 8 livres de démonstration créés");
        }
    }
}
