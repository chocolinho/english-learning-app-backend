package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public List<Topic> getAllTopics() {
        return topicService.getAllTopics();
    }

    @PostMapping
    public Topic createTopic(@RequestBody Topic topic) {
        return topicService.createTopic(topic);
    }

    @GetMapping("/{id}")
    public Topic getTopicById(@PathVariable Long id) {
        return topicService.getTopicById(id);
    }

    @PutMapping("/{id}")
    public Topic updateTopic(@PathVariable Long id, @RequestBody Topic topic) {
        return topicService.updateTopic(id, topic);
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
    }
}