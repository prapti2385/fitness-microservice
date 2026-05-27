// ActivityDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  getActivityDetail,
  getActivityRecommendation,
} from "../services/api";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

const ActivityDetail = () => {
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        // Fetch activity details
        const activityResponse = await getActivityDetail(id);
        setActivity(activityResponse.data);

        // Fetch AI recommendation
        const recommendationResponse =
          await getActivityRecommendation(id);

        setRecommendation(recommendationResponse.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchActivityDetail();
  }, [id]);

  if (!activity) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      {/* Activity Details */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Activity Details
          </Typography>

          <Typography>
            Type: {activity.type}
          </Typography>

          <Typography>
            Duration: {activity.duration} minutes
          </Typography>

          <Typography>
            Calories Burnt: {activity.caloriesBurnt}
          </Typography>

          <Typography>
            Date:{" "}
            {new Date(activity.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      {recommendation && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              AI Recommendation
            </Typography>

            <Typography variant="h6">
              Analysis
            </Typography>

            <Typography paragraph>
              {recommendation.recommendation}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">
              Improvements
            </Typography>

            {recommendation?.improvements?.map(
              (improvement, index) => (
                <Typography key={index} paragraph>
                  • {improvement}
                </Typography>
              )
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">
              Suggestions
            </Typography>

            {recommendation?.suggestions?.map(
              (suggestion, index) => (
                <Typography key={index} paragraph>
                  • {suggestion}
                </Typography>
              )
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">
              Safety Guidelines
            </Typography>

            {recommendation?.safety?.map(
              (safety, index) => (
                <Typography key={index} paragraph>
                  • {safety}
                </Typography>
              )
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;