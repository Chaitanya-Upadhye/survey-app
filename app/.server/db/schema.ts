import { pgTable, serial, jsonb, timestamp, varchar, unique,integer } from 'drizzle-orm/pg-core';

export const surveyResponses = pgTable('survey_responses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  surveyId: varchar('survey_id').notNull(),
  response: jsonb('response').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  userSurveyUnique: unique('user_survey_unique').on(table.userId, table.surveyId)
}));
