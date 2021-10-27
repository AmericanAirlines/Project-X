import { Router } from 'express';
import { Project } from '../entities/Project';
import logger from '../logger';

export const project = Router();

project.post('/', async (req, res) => {
  try {
    const fetchRes = await fetch('https://api.github.com/orgs/AmericanAirlines/repos');

    const projects = await fetchRes.json();

    // Select one by one or by user
    for (let i = 0; i < projects.length; i += 1) {
      const currentProjects = await req.entityManager.findOne(Project, { nodeID: projects[i].node_id });
      if (!currentProjects) {
        const newProject = new Project({ nodeID: projects[i].node_id });
        req.entityManager.persist(newProject);
      }
    }

    await req.entityManager.flush();

    res.status(201).send(projects);
  } catch (error) {
    const errorMessage = 'There was an issue adding the project(s) to the database'
    logger.error(errorMessage, error);
    res.status(500).send(errorMessage);
  }
});
