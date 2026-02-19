import { useState } from 'react';
import { CASE_STUDIES } from '../../../data/workspaceData';

export function ProjectsWindowContent() {
  const [activeProjectTitle, setActiveProjectTitle] = useState(CASE_STUDIES[0]?.title ?? '');
  const activeProject = CASE_STUDIES.find((study) => study.title === activeProjectTitle) ?? CASE_STUDIES[0];

  if (!activeProject) return null;

  return (
    <section className="projects-window">
      <header className="projects-intro">
        <h4>Case Studies</h4>
        <p>
          I turn complex product workflows into clear, reliable interfaces. My strength is research, planning, and
          shipping fast frontend experiences.
        </p>
      </header>

      <div className="project-master-detail">
        <aside className="project-list" aria-label="Project case studies">
          {CASE_STUDIES.map((study) => (
            <button
              key={study.title}
              type="button"
              className={`project-list-item${activeProject.title === study.title ? ' is-active' : ''}`}
              onClick={() => setActiveProjectTitle(study.title)}
            >
              <span>{study.client}</span>
              <strong>{study.title}</strong>
            </button>
          ))}
        </aside>

        <article className="project-story-card">
          {activeProject.imageUrl ? (
            <img
              src={activeProject.imageUrl}
              alt={`${activeProject.title} preview`}
              className="project-story-image"
              loading="lazy"
            />
          ) : null}

          <div className="project-story-head">
            <span>{activeProject.client}</span>
            <h5>{activeProject.title}</h5>
          </div>

          {(activeProject.githubUrl || activeProject.liveUrl) && (
            <div className="project-story-links">
              {activeProject.githubUrl ? (
                <a href={activeProject.githubUrl} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              ) : null}
              {activeProject.liveUrl ? (
                <a href={activeProject.liveUrl} target="_blank" rel="noreferrer">
                  Live Site
                </a>
              ) : null}
            </div>
          )}

          <div className="project-story-block">
            <h6>Problem</h6>
            <p>{activeProject.problem}</p>
          </div>

          <div className="project-story-block">
            <h6>What I Built</h6>
            <p>{activeProject.whatIDid}</p>
          </div>

          <div className="project-story-block">
            <h6>Technology</h6>
            <div className="project-tech-grid">
              {activeProject.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>

          <div className="project-story-block">
            <h6>Results</h6>
            <ul>
              {activeProject.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
