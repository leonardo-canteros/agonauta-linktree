import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { projects, site } from './data'
import './styles.css'

function ProjectCard({ project, index, isOpen, onToggle, onOpenModal, modalTriggerRef }) {
  const panelId = `details-${project.id}`
  const projectLink = project.links?.[0]

  return (
    <li className={`project-card${isOpen ? ' is-open' : ''}`}>
      <button
        className="project-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="thumb">
          <img
            src={project.image}
            alt=""
            loading={index < 2 ? 'eager' : 'lazy'}
            width="680"
            height="510"
          />
        </span>
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
              <img
                src={project.image}
                alt={project.imageAlt}
                loading="lazy"
                width="680"
                height="510"
              />
            </figure>
            <p className="detail-description">{project.description}</p>
            {project.moreDetails && (
              <button
                className="project-link more-button"
                type="button"
                aria-haspopup="dialog"
                onClick={onOpenModal}
                ref={modalTriggerRef}
              >
                Ver más <span aria-hidden="true">↗</span>
              </button>
            )}
            {projectLink && (
              <a className="project-link" href={projectLink.url} target="_blank" rel="noopener noreferrer">
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
  const [modalProject, setModalProject] = useState(null)
  const modalRef = useRef(null)
  const modalCloseRef = useRef(null)
  const modalTriggerRef = useRef(null)

  function closeModal() {
    setModalProject(null)
    window.requestAnimationFrame(() => modalTriggerRef.current?.focus({ preventScroll: true }))
  }

  useEffect(() => {
    if (!modalProject) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modalCloseRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
        return
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusable = [...modalRef.current.querySelectorAll('a[href], button:not([disabled])')]
        const first = focusable[0]
        const last = focusable.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [modalProject])

  return (
    <main className="page">
      <header className="profile">
        {site.logo && <img className="profile-logo" src={site.logo} alt="Logo oficial de Agronautas" width="104" height="104" />}
        <p className="profile-kicker">Software · Hardware · Robótica</p>
        <h1>{site.title}</h1>
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
              onOpenModal={() => setModalProject(project)}
              modalTriggerRef={project.moreDetails ? modalTriggerRef : undefined}
            />
          ))}
        </ul>
      </section>

      {modalProject && (
        <div
          className="service-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <section
            className="service-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            ref={modalRef}
          >
            <figure className="service-modal-image">
              <img src={modalProject.image} alt={modalProject.imageAlt} width="680" height="510" />
            </figure>
            <div className="service-modal-content">
              <button
                className="service-modal-close"
                type="button"
                aria-label="Cerrar"
                onClick={closeModal}
                ref={modalCloseRef}
              >
                <span aria-hidden="true">×</span>
              </button>
              <p className="section-kicker">Desarrollo a medida</p>
              <h2 id="service-modal-title">{modalProject.moreDetails.title}</h2>
              <p className="service-modal-intro">{modalProject.moreDetails.introduction}</p>
              <ul className="service-modal-list">
                {modalProject.moreDetails.services.map((service) => (
                  <li key={service.title}>
                    <strong>{service.title}:</strong> {service.description}
                  </li>
                ))}
              </ul>
              <h3>Cómo trabajamos</h3>
              <p className="service-modal-process">{modalProject.moreDetails.process}</p>
              <p className="service-modal-invitation">{modalProject.moreDetails.invitation}</p>
              {site.contact.length > 0 && (
                <div className="service-modal-contact" aria-label="Canales de contacto">
                  {site.contact.map((channel) => (
                    <a className="project-link" href={channel.url} target="_blank" rel="noopener noreferrer" key={channel.url}>
                      {channel.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      <footer className="contact" aria-labelledby="contact-heading">
        <div className="contact-heading">
          <span className="contact-symbol" aria-hidden="true">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <path d="M4 5.5h16v12H9l-5 3v-15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="m7 9 5 4 5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div><p className="section-kicker">¿Tenés una idea?</p><h2 id="contact-heading">Hablemos</h2></div>
        </div>
        <p className="contact-intro">Escribinos o llamanos para conversar sobre una idea.</p>
        <ul className="contact-list">
          {site.contact.map((channel) => (
            <li key={channel.url}>
              <a href={channel.url} target="_blank" rel="noopener noreferrer">
                {channel.label}<span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
