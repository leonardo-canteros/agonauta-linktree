import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { projects, site } from './data'
import './styles.css'

function ProjectCard({ project, index, isOpen, onToggle }) {
  const panelId = `details-${project.id}`
  const destination = project.links[0]

  return (
    <li className={`project-card${isOpen ? ' is-open' : ''}`}>
      <button
        className="project-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="thumb"><img src={project.image} alt="" loading={index < 2 ? 'eager' : 'lazy'} width="680" height="510" /></span>
        <span className="project-copy">
          <span className="project-name">{project.name}</span>
          <span className="project-short">{project.shortDescription}</span>
        </span>
        <span className="project-chevron" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="m2 5 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className="project-detail" id={panelId} aria-hidden={!isOpen} inert={!isOpen}>
        <div className="detail-clip">
          <div className="detail-inner">
            <div className="detail-rule" />
            <figure className="detail-figure">
              <img src={project.image} alt={project.imageAlt} loading="lazy" width="680" height="510" />
            </figure>
            <p className="detail-description">{project.description}</p>
            {project.note && <p className="detail-note">{project.note}</p>}
            {destination && (
              <a className="project-link" href={destination.url} target="_blank" rel="noopener noreferrer">
                Ver proyecto <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

function App() {
  const [openProject, setOpenProject] = useState(null)

  return (
    <main className="page">
      <header className="profile">
        {site.logo && <img className="profile-logo" src={site.logo} alt="Logo oficial de Agronautas" width="104" height="104" />}
        <p className="profile-kicker">Software · Hardware · Campo</p>
        <h1>{site.title}</h1>
        <p className="profile-intro">{site.introduction}</p>
      </header>

      <section className="directory" aria-labelledby="projects-heading">
        <div className="section-heading">
          <div><p className="section-kicker">Explorá lo que hacemos</p><h2 id="projects-heading">Nuestros proyectos</h2></div>
        </div>
        <ul className="project-list">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isOpen={openProject === project.id}
              onToggle={() => setOpenProject(openProject === project.id ? null : project.id)}
            />
          ))}
        </ul>
      </section>

      <footer className="contact" aria-labelledby="contact-heading">
        <div><p className="section-kicker">Conversemos</p><h2 id="contact-heading">Contacto</h2></div>
        {site.contact.length ? (
          <ul className="contact-list">
            {site.contact.map((channel) => (
              <li key={channel.url}><a href={channel.url} target="_blank" rel="noopener noreferrer">{channel.label}<span aria-hidden="true">↗</span></a></li>
            ))}
          </ul>
        ) : (
          <p className="contact-empty">Canales oficiales pendientes de publicación.</p>
        )}
        <p className="photo-note">Las fotografías son ilustrativas y no muestran instalaciones o prototipos del equipo.</p>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
