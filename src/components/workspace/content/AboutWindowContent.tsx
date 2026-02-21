import { useState, type KeyboardEvent } from 'react';
import { ABOUT_TABS, SOCIAL_LINKS, type AboutTab, type SocialKey } from '../../../data/workspaceData';
import { SocialIcon } from './WorkspaceContentIcons';

const ABOUT_AVATAR_SRC_1X =
  'https://res.cloudinary.com/dkdteb9m5/image/upload/c_fill,g_face,q_auto,f_auto,dpr_auto,w_82,h_82/v1739381052/qnsyneuzwomdka0oqvws.jpg';
const ABOUT_AVATAR_SRC_2X =
  'https://res.cloudinary.com/dkdteb9m5/image/upload/c_fill,g_face,q_auto,f_auto,dpr_auto,w_164,h_164/v1739381052/qnsyneuzwomdka0oqvws.jpg';

export function AboutWindowContent() {
  const [activeTab, setActiveTab] = useState<AboutTab>('profile');
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }
    event.preventDefault();

    let targetIndex = index;
    if (event.key === 'ArrowRight') targetIndex = (index + 1) % ABOUT_TABS.length;
    if (event.key === 'ArrowLeft') targetIndex = (index - 1 + ABOUT_TABS.length) % ABOUT_TABS.length;
    if (event.key === 'Home') targetIndex = 0;
    if (event.key === 'End') targetIndex = ABOUT_TABS.length - 1;

    setActiveTab(ABOUT_TABS[targetIndex].id);
  };

  return (
    <section className="about-window-layout">
      <aside className="about-sidebar">
        <img
          className="about-avatar"
          src={ABOUT_AVATAR_SRC_1X}
          srcSet={`${ABOUT_AVATAR_SRC_1X} 1x, ${ABOUT_AVATAR_SRC_2X} 2x`}
          sizes="82px"
          width={82}
          height={82}
          alt="Portrait of Yasin Walum"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <div className="about-sidebar-head">
          <h3>Yasin Walum</h3>
          <p>Frontend Developer</p>
        </div>
        <ul className="about-quick-facts">
          <li>
            <span>Based</span>
            <strong>Kampala, Uganda</strong>
          </li>
          <li>
            <span>Focus</span>
            <strong>Research-driven frontend delivery</strong>
          </li>
          <li>
            <span>Strength</span>
            <strong>Planning before execution</strong>
          </li>
        </ul>
      </aside>

      <div className="about-main">
        <nav className="about-tabs" role="tablist" aria-label="About sections">
          {ABOUT_TABS.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={isActive ? 'about-tab is-active' : 'about-tab'}
                role="tab"
                id={`about-tab-${tab.id}`}
                aria-controls={`about-panel-${tab.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div
          className="about-panel"
          role="tabpanel"
          id={`about-panel-${activeTab}`}
          aria-labelledby={`about-tab-${activeTab}`}
          tabIndex={0}
        >
          {activeTab === 'profile' && (
            <>
              <h4>About Me</h4>
              <p>
                I am Yasin Walum, a Ugandan living in Kampala. I studied Computer Science and also studied Mathematics
                and Physics.
              </p>
              <p>
                I worked as a Mathematics and Physics teacher from 2014 to 2019, then moved into frontend development
                in 2020 and have been building modern web interfaces since then.
              </p>
              <p>
                I currently work at EzyAgric on the Farm Manager app as a Frontend Developer, where I improve product
                usability, build reliable interfaces for field workflows, and help the team deliver measurable product
                outcomes that are reflected in this portfolio.
              </p>
            </>
          )}

          {activeTab === 'journey' && (
            <div className="about-timeline">
              <article className="about-timeline-item">
                <span>Education</span>
                <h5>Computer Science Degree</h5>
                <p>Built a strong technical base and analytical problem-solving skills.</p>
              </article>
              <article className="about-timeline-item">
                <span>Academic Focus</span>
                <h5>Mathematics and Physics Studies</h5>
                <p>Developed structured thinking, precision, and logical reasoning.</p>
              </article>
              <article className="about-timeline-item">
                <span>2014 - 2019</span>
                <h5>Mathematics and Physics Teacher</h5>
                <p>Taught students, simplified hard topics, and improved communication skills.</p>
              </article>
              <article className="about-timeline-item">
                <span>2020 - Present</span>
                <h5>Frontend Developer</h5>
                <p>Designing and shipping clean, responsive, user-focused interfaces.</p>
              </article>
              <article className="about-timeline-item">
                <span>Current Role</span>
                <h5>Frontend Developer at EzyAgric (Farm Manager)</h5>
                <p>
                  Driving product quality through clear UX, faster iteration cycles, and features that support daily
                  operations in agriculture.
                </p>
              </article>
            </div>
          )}

          {activeTab === 'interests' && (
            <>
              <h4>Interests and Personal Side</h4>
              <p>Outside work, I enjoy movies, series, and spending free time in nature.</p>
              <div className="about-interest-tags">
                <span>Movies</span>
                <span>Series</span>
                <span>Nature Trips</span>
                <span>Exploring New Places</span>
                <span>Long Walks</span>
              </div>
            </>
          )}

          {activeTab === 'socials' && (
            <>
              <h4>Connect</h4>
              <p>Find me on social platforms and follow my work.</p>
              <div className="about-social-grid">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="about-social-title">
                      <i className={`about-social-icon about-social-${link.key}`} aria-hidden="true">
                        <SocialIcon platform={link.key as SocialKey} />
                      </i>
                      {link.label}
                    </span>
                    <strong>Open profile</strong>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
