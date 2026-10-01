import React from 'react'
import { createRoot } from 'react-dom/client'
import { projects, site } from './data'
import './styles.css'

const allProjects = [projects.featured, ...projects.agro, ...projects.other]

function ProjectItem({ project }) {
  const destination = project.links[0]
  const content = (
    <>
      <span className="project-copy">
        <span className="project-name">{project.name}</span>
        <span className="project-description">{project.shortDescription}</span>
        {project.id === 'agronautas' && <span className="project-note">En desarrollo · demos con datos simulados</span>}
      </span>
      <span className={destination ? 'project-arrow' : 'project-unavailable'} aria-hidden={destination ? 'true' : undefined}>
        {destination ? '↗' : 'Sin enlace'}
      </span>
    </>
  )

  return (
    <li>
      {destination ? (
        <a className="project-row has-link" href={destination.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${project.name}: ${destination.label}`}>
          {content}
        </a>
      ) : (
        <div className="project-row no-link">{content}</div>
      )}
    </li>
  )
}

function App() {
  return (
    <main className="page">
      <header className="profile">
        {site.logo && <img className="profile-logo" src={site.logo} alt="Logo de Agronautas" />}
        <p className="profile-kicker">Software · hardware · ideas para el mundo real</p>
        <h1>{site.title}</h1>
        <p className="profile-intro">{site.introduction}</p>
      </header>

      <section className="directory" aria-labelledby="projects-heading">
        <div className="section-heading">
          <h2 id="projects-heading">Proyectos</h2>
          <span>{String(allProjects.length).padStart(2, '0')} iniciativas</span>
        </div>
        <ul className="project-list">
          {allProjects.map((project) => <ProjectItem key={project.id} project={project} />)}
        </ul>
      </section>

      <footer className="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contacto</h2>
        {site.contact.length ? (
          <ul className="contact-list">
            {site.contact.map((channel) => (
              <li key={channel.url}><a href={channel.url} target="_blank" rel="noopener noreferrer">{channel.label}<span aria-hidden="true">↗</span></a></li>
            ))}
          </ul>
        ) : (
          <p>Canales oficiales pendientes de publicación.</p>
        )}
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
