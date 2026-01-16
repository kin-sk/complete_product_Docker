package com.example.todo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * ToDoリポジトリ
 * データベース操作を担当
 */
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    // JpaRepositoryが基本的なCRUD操作を提供
    // findAll(), findById(), save(), deleteById() など
}
