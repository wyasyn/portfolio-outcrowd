import { useState } from "react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { CASE_STUDIES } from "../../../data/workspaceData";
import { Icon } from "../../ui/Icon";

export function ProjectsWindowContent() {
  const [activeProjectTitle, setActiveProjectTitle] = useState<string | null>(
    null,
  );
  const activeProject =
    CASE_STUDIES.find((study) => study.title === activeProjectTitle) ?? null;

  return (
    <section className={`projects-window${activeProject ? ' is-detail' : ''}`}>
      {!activeProject ? (
        <header className="projects-intro">
          <h4>Case Studies</h4>
          <p>
            I turn complex product workflows into clear, reliable interfaces. My
            strength is research, planning, and shipping fast frontend
            experiences.
          </p>
        </header>
      ) : null}

      {activeProject ? (
        <article className="project-detail-view">
          <button
            type="button"
            className="project-back-button"
            onClick={() => setActiveProjectTitle(null)}
          >
            <Icon icon={ArrowLeft01Icon} size={14} />
            <span>Back to projects</span>
          </button>

          <div className="project-story-card">
            {activeProject.imageUrl || activeProject.thumbnailUrl ? (
              <img
                src={activeProject.imageUrl ?? activeProject.thumbnailUrl}
                alt={`${activeProject.title} preview`}
                className="project-story-image"
                loading="lazy"
                decoding="async"
              />
            ) : null}

            <div className="project-story-head">
              <span>{activeProject.client}</span>
              <h5>{activeProject.title}</h5>
            </div>

            {(activeProject.githubUrl || activeProject.liveUrl) && (
              <div className="project-story-links">
                {activeProject.githubUrl ? (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                ) : null}
                {activeProject.liveUrl ? (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
          </div>
        </article>
      ) : (
        <div className="project-bento-grid" aria-label="Project case studies">
          {CASE_STUDIES.map((study) => (
            <button
              key={study.title}
              type="button"
              className="project-bento-card"
              onClick={() => setActiveProjectTitle(study.title)}
            >
              <div className="project-bento-thumb">
                {study.thumbnailUrl || study.imageUrl ? (
                  <img
                    src={study.thumbnailUrl ?? study.imageUrl}
                    alt={`${study.title} preview`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span>{study.client}</span>
                )}
              </div>
              <div className="project-bento-meta">
                <span>{study.client}</span>
                <strong>{study.title}</strong>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
