package com.taxeasyfile.services;

import com.taxeasyfile.models.Category;
import com.taxeasyfile.repositories.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


@Service
public class CategoryService {
    private CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public ResponseEntity<Iterable<Category>> findAll() {
        Iterable<Category> categories;
        try {
            categories = categoryRepository.findAll();
            if(!categories.iterator().hasNext())
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(categories);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
