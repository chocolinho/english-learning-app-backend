package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    List<QuizResult> findByUserId(Long userId);
}