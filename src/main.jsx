import React from 'react'
import { createRoot } from 'react-dom/client'
import { projects, site } from './data'
import './styles.css'

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}

function Links({ links, className = '' }) {
  if (!links.length) return null

  return (
    <div className={`links ${className}`}>
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
          {link.label} <Arrow diagonal />
        </a>
      ))}
    </div>
  )
}

function ProjectCard({ project, index }) {
  return (
    <article className="project-card" id={project.id}>
      <div className="card-topline">
        <span className="project-index">{String(index).padStart(2, '0')}</span>
        <span className="project-category">{project.category}</span>
      </div>
      <div className="card-body">
        {project.logo && <img className="project-logo" src={project.logo} alt="" />}
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
      <div className="card-bottomline">
        <span className="status"><span className="status-dot" />{project.status}</span>
        <Links links={project.links} />
      </div>
    </article>
  )
}

function App() {
  const contactAvailable = site.contact.length > 0

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <a className="identity" href="#inicio" aria-label="Ir al inicio">
          <span className="identity-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>Proyectos del equipo</span>
        </a>
        <nav aria-label="Navegación principal">
          <a className="nav-projects" href="#proyectos">Explorar proyectos</a>
          <a className="nav-contact" href="#contacto">Contacto <Arrow diagonal /></a>
        </nav>
      </header>

      <main id="contenido">
        <section className="hero shell" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" />{site.eyebrow}</p>
            <h1 id="hero-title">Proyectos<br /><em>del equipo<span className="period">.</span></em></h1>
            <p className="hero-intro">{site.introduction}</p>
            <div className="hero-actions">
              <a className="primary-link" href="#proyectos">Conocé lo que hacemos <Arrow /></a>
              <a className="text-link" href="#contacto">Contactanos <Arrow diagonal /></a>
            </div>
          </div>
          <div className="hero-graphic" aria-hidden="true">
            <div className="graphic-ring ring-outer" /><div className="graphic-ring ring-middle" /><div className="graphic-ring ring-inner" />
            <span className="graphic-node node-one" /><span className="graphic-node node-two" /><span className="graphic-node node-three" /><span className="graphic-node node-four" />
            <div className="graphic-center"><span>08</span><small>personas<br />muchas ideas</small></div>
            <span className="graphic-caption">Conectamos ideas con posibilidades</span>
          </div>
          <div className="hero-bottom"><span>01 / 03</span><span>Deslizá para explorar ↓</span></div>
        </section>

        <section className="featured-section section-pad" id="proyectos" aria-labelledby="featured-heading">
          <div className="shell">
            <div className="section-heading">
              <p className="section-kicker">01 — Proyecto destacado</p>
              <h2 id="featured-heading">Tecnología que<br /><em>echa raíces.</em></h2>
            </div>
            <article className="featured-card" id="agronautas">
              <div className="featured-copy">
                <div className="featured-header"><span className="feature-icon" aria-hidden="true">✳</span><span className="status light"><span className="status-dot" />{projects.featured.status}</span></div>
                {projects.featured.logo && <img className="featured-logo" src={projects.featured.logo} alt="" />}
                <p className="feature-category">{projects.featured.category}</p>
                <h3>{projects.featured.name}</h3>
                <p className="feature-description">{projects.featured.description}</p>
                <div className="feature-footer">
                  <p className="demo-note"><span aria-hidden="true">ⓘ</span> {projects.featured.note}</p>
                  <Links links={projects.featured.links} className="featured-links" />
                </div>
              </div>
              <div className="feature-visual" aria-label="Ilustración conceptual de monitoreo de huertas; no representa datos reales">
                <div className="visual-head"><span>CAMPO / HUERTAS</span><span>VISTA CONCEPTUAL</span></div>
                <div className="plot-area" aria-hidden="true">
                  <div className="plot plot-a"><span /></div><div className="plot plot-b"><span /></div><div className="plot plot-c"><span /></div>
                  <div className="plot plot-d"><span /></div><div className="plot plot-e"><span /></div><div className="plot plot-f"><span /></div>
                  <div className="scan-line" />
                </div>
                <div className="visual-foot"><span><i />Observación</span><span>Jakaru Porá · propuesta</span></div>
              </div>
            </article>
          </div>
        </section>

        <section className="agro-section section-pad" aria-labelledby="agro-heading">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><p className="section-kicker">02 — Más ideas para el campo</p><h2 id="agro-heading">Otras iniciativas<br /><em>agropecuarias.</em></h2></div>
              <p>Exploramos nuevas formas de acercar tecnología a los procesos productivos.</p>
            </div>
            <div className="agro-grid">
              {projects.agro.map((project, index) => <ProjectCard key={project.id} project={project} index={index + 1} />)}
            </div>
          </div>
        </section>

        <section className="other-section section-pad" aria-labelledby="other-heading">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><p className="section-kicker">03 — Más allá del campo</p><h2 id="other-heading">Ideas para<br /><em>la vida cotidiana.</em></h2></div>
              <p>Productos y experiencias que nacen de escuchar necesidades diferentes.</p>
            </div>
            <div className="projects-grid">
              {projects.other.map((project, index) => <ProjectCard key={project.id} project={project} index={index + 3} />)}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contacto">
        <div className="shell footer-main">
          <div><p className="section-kicker">Sigamos en contacto</p><h2>Una conversación<br /><em>puede empezar algo.</em></h2></div>
          <div className="footer-contact">
            {contactAvailable ? (
              <><p>Escribinos por nuestros canales oficiales:</p><Links links={site.contact} /></>
            ) : (
              <p>Estamos preparando nuestros canales oficiales. Si nos conociste en el evento, acercate a conversar con el equipo.</p>
            )}
          </div>
        </div>
        <div className="shell footer-bottom"><span>Ocho emprendedores · Software + hardware</span><a href="#inicio">Volver arriba ↑</a></div>
      </footer>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
