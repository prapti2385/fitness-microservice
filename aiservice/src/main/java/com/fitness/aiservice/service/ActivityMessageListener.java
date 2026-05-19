package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ActivityMessageListener {

    public ActivityAIService activityAIService;
    public RecommendationRepository recommendationRepository;

    public ActivityMessageListener(ActivityAIService activityAIService, RecommendationRepository recommendationRepository) {
        this.activityAIService = activityAIService;
        this.recommendationRepository = recommendationRepository;
    }

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity) {
        log.info("Received activity for processing: {}", activity.getId());
//        log.info("Generated Recommendation for activity: {}", activityAIService.generateRecommendation(activity));
        Recommendation recommendation = activityAIService.generateRecommendation(activity);
        recommendationRepository.save(recommendation);
    }
}
