import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { projects, site } from './data'
import './styles.css'

function ProjectCard({ project, index, isOpen, onToggle, onOpenModal, modalTriggerRef }) {
  const panelId = `details-${project.id}`
  const destination = project.links?.[0]
  const opensModal = project.interaction === 'modal'

  const cardContents = (
    <>
      <span className="thumb"><img src={project.image} alt="" loading={index < 2 ? 'eager' : 'lazy'} width="680" height="510" /></span>
      <span className="project-copy">
        <span className="project-name">{project.name}</span>
        <span className="project-short">{project.shortDescription}</span>
      </span>
      <span className="project-chevron" aria-hidden="true">
        {project.destination || opensModal ? '↗' : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="m2 5 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </>
  )

  if (project.destination) {
    return (
      <li className="project-card">
        <a className="project-trigger project-direct-link" href={project.destination} target="_blank" rel="noopener noreferrer" aria-label={`${project.name}: ${project.shortDescription}`}>
          {cardContents}
        </a>
      </li>
    )
  }

  return (
    <li className={`project-card${isOpen ? ' is-open' : ''}${opensModal ? ' is-modal' : ''}`}>
      <button
        className="project-trigger"
        type="button"
        ref={opensModal ? modalTriggerRef : undefined}
        aria-expanded={opensModal ? undefined : isOpen}
        aria-controls={opensModal ? undefined : panelId}
        aria-haspopup={opensModal ? 'dialog' : undefined}
        onClick={opensModal ? onOpenModal : onToggle}
      >
        {cardContents}
      </button>
      {!opensModal && (
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
      )}
    </li>
  )
}

function App() {
  const [openProject, setOpenProject] = useState(null)
  const [modalProject, setModalProject] = useState(null)
  const modalRef = useRef(null)
  const modalCloseRef = useRef(null)
  const modalTriggerRef = useRef(null)

  useEffect(() => {
    if (!modalProject) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modalCloseRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setModalProject(null)
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
      window.requestAnimationFrame(() => modalTriggerRef.current?.focus({ preventScroll: true }))
    }
  }, [modalProject])

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
              onOpenModal={() => setModalProject(project)}
              modalTriggerRef={modalTriggerRef}
            />
          ))}
        </ul>
      </section>

      {modalProject && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalProject(null)
          }}
        >
          <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" ref={modalRef}>
            <figure className="modal-image">
              <img src={modalProject.image} alt={modalProject.imageAlt} width="680" height="510" />
              <span className="modal-image-mark" aria-hidden="true">Robótica · Dispositivos</span>
            </figure>
            <div className="modal-copy">
              <button className="modal-close" type="button" aria-label="Cerrar" onClick={() => setModalProject(null)} ref={modalCloseRef}>
                <span aria-hidden="true">×</span>
              </button>
              <p className="section-kicker">Desarrollo a medida</p>
              <h2 id="project-modal-title">{modalProject.modalTitle}</h2>
              <p className="modal-description">{modalProject.description}</p>
              <p className="modal-invitation">{modalProject.modalInvitation}</p>
              {site.contact.length > 0 && (
                <div className="modal-contact" aria-label="Canales de contacto">
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
