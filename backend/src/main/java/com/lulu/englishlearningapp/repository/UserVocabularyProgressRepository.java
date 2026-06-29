package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.UserVocabularyProgress;
import com.lulu.englishlearningapp.entity.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserVocabularyProgressRepository extends JpaRepository<UserVocabularyProgress, Long> {

    List<UserVocabularyProgress> findByUserOrderByLastReviewedAtDesc(User user);

    Optional<UserVocabularyProgress> findByUserAndVocabulary(User user, Vocabulary vocabulary);
}
