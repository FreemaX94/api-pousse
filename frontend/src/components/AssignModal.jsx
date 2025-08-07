// src/components/AssignModal.jsx

import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function AssignModal({ isOpen, onClose, item, projects, onConfirm }) {
  const [projectId, setProjectId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  function handleSubmit() {
    if (!projectId) return;
    onConfirm({ projectId, quantity, note });
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Fond premium */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)'
          }} />
        </Transition.Child>

        {/* Contenu centré */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel style={{
                width: '100%',
                maxWidth: '500px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '32px',
                padding: '3rem',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left'
              }}>
                {/* Background decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(59,130,246,0.03), rgba(16,185,129,0.03))',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }} />

                <div style={{
                  textAlign: 'center',
                  marginBottom: '2rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Dialog.Title style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.5rem'
                  }}>
                    🎯 Assigner au projet
                  </Dialog.Title>
                  <p style={{
                    color: '#64748b',
                    fontSize: '1rem',
                    fontWeight: '500',
                    margin: 0
                  }}>
                    Ajouter « {item?.name} » à un projet
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '1.5rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>🏗️ Projet *</label>
                    <select
                      value={projectId}
                      onChange={e => setProjectId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.5rem',
                        border: '2px solid rgba(148,163,184,0.3)',
                        borderRadius: '16px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        background: 'rgba(255,255,255,0.9)',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
                    >
                      <option value="">— Choisir un projet —</option>
                      {projects.map(p => (
                        <option key={p._id} value={p._id}>
                          {p.client}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>📦 Quantité</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '1rem 1.5rem',
                        border: '2px solid rgba(148,163,184,0.3)',
                        borderRadius: '16px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        background: 'rgba(255,255,255,0.9)',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>📝 Note (optionnel)</label>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Note optionnelle..."
                      style={{
                        width: '100%',
                        padding: '1rem 1.5rem',
                        border: '2px solid rgba(148,163,184,0.3)',
                        borderRadius: '16px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        background: 'rgba(255,255,255,0.9)',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '80px'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
                    />
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  marginTop: '2rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '1rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(148,163,184,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(148,163,184,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(148,163,184,0.2)';
                    }}
                  >
                    ❌ Annuler
                  </button>
                  
                  <button
                    type="button"
                    disabled={!projectId}
                    onClick={handleSubmit}
                    style={{
                      background: !projectId ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '1rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: !projectId ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: !projectId ? '0 4px 12px rgba(156,163,175,0.3)' : '0 8px 25px rgba(59,130,246,0.3)',
                      opacity: !projectId ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (projectId) {
                        e.target.style.transform = 'translateY(-2px) scale(1.02)';
                        e.target.style.boxShadow = '0 12px 30px rgba(59,130,246,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (projectId) {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 8px 25px rgba(59,130,246,0.3)';
                      }
                    }}
                  >
                    ✨ Assigner
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
