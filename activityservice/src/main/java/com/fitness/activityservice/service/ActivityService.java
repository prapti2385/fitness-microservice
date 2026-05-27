package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.extern.slf4j.XSlf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    public ActivityService(ActivityRepository activityRepository, UserValidationService userValidationService, RabbitTemplate rabbitTemplate) {
        this.activityRepository = activityRepository;
        this.userValidationService = userValidationService;
        this.rabbitTemplate = rabbitTemplate;
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse activityResponse = new ActivityResponse();
        activityResponse.setId(activity.getId());
        activityResponse.setUserId(activity.getUserId());
        activityResponse.setDuration(activity.getDuration());
        activityResponse.setCaloriesBurnt(activity.getCaloriesBurnt());
        activityResponse.setStartTime(activity.getStartTime());
        activityResponse.setAdditionalMetrics(activity.getAdditionalMetrics());
        activityResponse.setType(activity.getType());
        activityResponse.setCreatedAt(activity.getCreatedAt());
        activityResponse.setUpdatedAt(activity.getUpdatedAt());
        return activityResponse;
    }

    public ActivityResponse trackActivity(ActivityRequest request) {
//        boolean isValidUser = userValidationService.validateUser(request.getUserId());
//        if(!isValidUser) {
//            throw new RuntimeException("Invalid user id");
//        }
        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .duration(request.getDuration())
                .type(request.getType())
                .caloriesBurnt(request.getCaloriesBurnt())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics()).build();
        Activity savedActivity = activityRepository.save(activity);

        // Publish to RabbitMQ
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        } catch (Exception e) {
            log.error("Failed to publish activity to RabbitMQ: ", e);
        }
        return mapToResponse(savedActivity);
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ActivityResponse getActivitiesById(String activityId) {
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new RuntimeException("Activity not found"));
        return mapToResponse(activity);
    }


}
