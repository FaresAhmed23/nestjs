// src/database/seeds/generate-test-data.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { MatchesService } from '../../matches/matches.service';
import { ProjectsService } from '../../projects/projects.service';

async function generateTestData() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const projectsService = app.get(ProjectsService);
    const matchesService = app.get(MatchesService);

    // Get all projects
    const projects = await projectsService.findAll();
    console.log(`Found ${projects.length} projects`);

    if (projects.length === 0) {
      console.log('No projects found. Please create projects first.');
      return;
    }

    // Generate matches for each project
    for (const project of projects) {
      console.log(`Generating matches for project in ${project.country}...`);
      try {
        const matches = await matchesService.rebuildMatches(project.id);
        console.log(
          `Generated ${matches.length} matches for project ${project.id}`,
        );
      } catch (error) {
        console.error(
          `Error generating matches for project ${project.id}:`,
          error.message,
        );
      }
    }

    console.log('Test data generation completed!');
  } catch (error) {
    console.error('Error generating test data:', error);
  } finally {
    await app.close();
  }
}

generateTestData();
