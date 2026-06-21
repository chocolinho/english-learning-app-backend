package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Long> {

}