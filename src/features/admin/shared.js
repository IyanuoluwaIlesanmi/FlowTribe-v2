/**
 * Shared admin helpers.
 *
 * Small pieces every admin screen needs. Kept together so error states, status
 * chips, and permission gating look identical everywhere rather than being
 * re-invented per screen.
 *
 * @module features/admin/shared
 */

import { el } from '../../core/dom.js';
import { Badge, Button, EmptyState } from '../../components/ui/index.js';
import { Icons } from '../../lib/icons.js';
import { can } from '../../core/session.js';

/**
 * A failed load, with a way out.
 *
 * Every admin screen uses this, so a network failure never leaves a blank
 * panel with no explanation and no retry.
 *
 * @param {import('../../core/errors.js').AppError} error
 * @param {Function} onRetry
 * @returns {HTMLElement}
 */
export function ErrorState(error, onRetry) {
  const forbidden = error.code === 'FORBIDDEN';

  return el('div', { class: 'ft-admin-error' }, EmptyState({
    title: forbidden ? 'You do not have access to this' : 'That did not load',
    message: error.message,
    iconPaths: forbidden ? Icons.lock : Icons.alert,
    action: forbidden
      ? null
      : Button({ label: 'Try again', variant: 'secondary', iconPaths: Icons.refresh, onClick: onRetry }),
  }));
}

/**
 * Member status chip.
 *
 * @param {string} status
 * @returns {HTMLElement}
 */
export function StatusBadge(status) {
  const active = status === 'Active';
  return Badge({
    label: active ? 'Active' : 'Paused',
    tone: active ? 'success' : 'warning',
    dot: true,
  });
}

/**
 * Role chip. Super Admin is visually distinct because it is the role that can
 * change other roles.
 *
 * @param {string} role
 * @returns {HTMLElement}
 */
export function RoleBadge(role) {
  if (role === 'SuperAdmin') return Badge({ label: 'Super Admin', tone: 'brand' });
  if (role === 'CommunityManager') return Badge({ label: 'Manager', tone: 'info' });
  return Badge({ label: 'Member', tone: 'neutral' });
}

/**
 * Render something only if the session holds a capability.
 *
 * A convenience for hiding controls that would fail anyway — NOT a security
 * measure. The server refuses the action regardless of what the client draws;
 * this only avoids showing a button that would return FORBIDDEN.
 *
 * @param {string} capability
 * @param {Function} render  () => Node
 * @returns {Node|null}
 */
export function ifCan(capability, render) {
  return can(capability) ? render() : null;
}

/**
 * A labelled section inside a detail panel.
 *
 * @param {string} title
 * @param {Array|Node} children
 * @returns {HTMLElement}
 */
export function Panel(title, children) {
  return el('section', { class: 'ft-admin-panel' }, [
    el('h3', { class: 'ft-admin-panel__title', text: title }),
    el('div', { class: 'ft-admin-panel__body' }, children),
  ]);
}
