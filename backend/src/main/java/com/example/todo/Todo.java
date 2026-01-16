package com.example.todo;

import jakarta.persistence.*;
import lombok.Data;

/**
 * ToDoエンティティクラス
 * データベースのtodosテーブルに対応
 */
@Entity
@Table(name = "todos")
@Data
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Boolean completed = false;
}
