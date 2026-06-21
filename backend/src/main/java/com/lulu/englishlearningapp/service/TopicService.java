package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Topic createTopic(Topic topic) {
        return topicRepository.save(topic);
    }

    public Topic getTopicById(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    public Topic updateTopic(Long id, Topic topic) {
        Topic existingTopic = getTopicById(id);

        existingTopic.setName(topic.getName());
        existingTopic.setDescription(topic.getDescription());

        return topicRepository.save(existingTopic);
    }

    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }
}
