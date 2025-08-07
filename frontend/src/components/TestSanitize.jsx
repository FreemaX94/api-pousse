// frontend/src/components/TestSanitize.jsx
import React from 'react';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

const malicious = `
  <h3>Salut</h3>
  <img src="x" onerror="alert('XSS!')" />
  <script>alert('Bad')</script>
  <p>Ton texte sûr.</p>
`;

export default function TestSanitize() {
  return (
    <div>
      <h2>Avant sanitation</h2>
      <div dangerouslySetInnerHTML={{ __html: malicious }} />

      <h2>Après sanitation</h2>
      <div dangerouslySetInnerHTML={sanitizeHtml(malicious)} />
    </div>
  );
}

