export const emailService = {
  pattern: 'send_email',
  deadLetterPattern: 'emails_dead_letter',
};

export const cacheKeys = {
  userWeatherRequestCount: (userId: number) =>
    `weather-user-requests-${userId}`,
  weatherData: (city: string, date: string) => `${city}-${date}`,
};
