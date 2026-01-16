package com.example.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ToDo REST APIコントローラー
 * エンドポイント: /api/todos
 */
@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*") // CORS対応（開発用）
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    /**
     * 全ToDo取得
     * GET /api/todos
     */
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    /**
     * 特定のToDo取得
     * GET /api/todos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ToDo作成
     * POST /api/todos
     */
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoRepository.save(todo);
    }

    /**
     * ToDo更新
     * PUT /api/todos/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(todoDetails.getTitle());
                    todo.setCompleted(todoDetails.getCompleted());
                    return ResponseEntity.ok(todoRepository.save(todo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ToDo削除
     * DELETE /api/todos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
