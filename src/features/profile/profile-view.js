/**
 * Member profile.
 *
 * A member's own record of what they have built: who they are, what they
 * committed to, their level, their milestones, their numbers, and their
 * calendar.
 *
 * The calendar appears here as well as on the dashboard deliberately. On the
 * dashboard it answers "how am I doing?"; here it is closer to a record of
 * work — the same component, two different questions.
 *
 * @module features/profile/profile-view
 */

import { el, icon } from '../../core/dom.js';
import { mount } from '../../core/component.js';
import { Avatar, Button, Card, EmptyState, Skeleton } from '../../components/ui/index.js';
import { ActivityCalendar, StatCard } from '../../components/brand/index.js';
import { LevelChip, MilestoneBadge } from '../../components/brand/milestone.js';
import { PageHeader, Section } from '../../components/layout/index.js';
import { Icons } from '../../lib/icons.js';
import { getPlatform, goalLabel } from '../../lib/platforms.js';
import { date, number, plural } from '../../lib/format.js';
import { call } from '../../core/api.js';
import { toAppError } from '../../core/errors.js';
import { clearSession } from '../../core/session.js';
import { navigate } from '../../app/navigation.js';
import { openMilestoneModal } from '../milestones/milestone-modal.js';
import { confirmModal } from '../../components/ui/modal.js';

export default function ProfileView() {
  const root = el('div', { class: 'ft-animate-in' });

  mount(root, Loading());
  load();

  async function load() {
    try {
      const data = await call('member.profile');
      mount(root, render(data));
    } catch (error) {
      mount(root, Card({}, EmptyState({
        title: 'We could not load your profile',
        message: toAppError(error).message,
        iconPaths: Icons.alert,
        action: Button({ label: 'Try again', variant: 'secondary', onClick: load }),
      })));
    }
  }

  return root;
}

function render(data) {
  const { member, stats, calendar, milestones, level, joinDate } = data;
  const platform = getPlatform(member.platform);
  const earned = milestones.milestones.filter((m) => m.unlocked);

  return el('div', { class: 'ft-stack ft-gap-6' }, [
    /* Identity */
    Card({}, [
      el('div', { class: 'ft-profile-head' }, [
        Avatar({ name: member.fullName, size: 'xl' }),
        el('div', { class: 'ft-profile-head__body' }, [
          el('h1', { class: 'ft-profile-head__name', text: member.fullName }),
          el('p', { class: 'ft-profile-head__username', text: `@${member.username}` }),
          el('div', { class: 'ft-profile-head__chips' }, [
            LevelChip({ name: level.name, iconId: level.iconId, size: 'sm' }),
          ]),
        ]),
      ]),

      el('dl', { class: 'ft-profile-facts' }, [
        Fact('Platform', platform.label, platform.iconPaths, platform.color),
        Fact('Weekly goal', goalLabel(member.weeklyGoal), Icons.target),
        Fact('Member since', date(joinDate, { withYear: true }), Icons.calendar),
      ]),
    ]),

    /* Numbers */
    Section({ title: 'Posting statistics' }, [
      el('div', { class: 'ft-grid ft-grid--4' }, [
        StatCard({ label: 'Lifetime posts', value: number(stats.allTimePosts), iconPaths: Icons.fileText }),
        StatCard({ label: 'Active days', value: number(stats.activeDays), iconPaths: Icons.calendarCheck }),
        StatCard({ label: 'Goal weeks', value: number(stats.perfectWeeks), iconPaths: Icons.checkCircle }),
        StatCard({
          label: 'Longest streak',
          value: stats.longestWeekStreak,
          meta: plural(stats.longestWeekStreak, 'week'),
          iconPaths: Icons.medal,
        }),
      ]),
    ]),

    /* Calendar */
    Section({ title: 'Activity' }, Card({}, ActivityCalendar({
      from: calendar.from,
      to: calendar.to,
      counts: calendar.counts,
      today: calendar.today,
    }))),

    /* Milestones earned */
    Section(
      {
        title: 'Milestones earned',
        action: el('a', { class: 'ft-section__action', attrs: { href: '#/milestones' }, text: 'See all' }),
      },
      earned.length
        ? el(
            'div',
            { class: 'ft-profile-medals' },
            earned.map((milestone) =>
              el(
                'button',
                {
                  class: 'ft-profile-medals__item',
                  type: 'button',
                  attrs: { 'aria-label': milestone.name },
                  on: { click: () => openMilestoneModal(milestone) },
                },
                [
                  MilestoneBadge({
                    iconId: milestone.iconId,
                    unlocked: true,
                    rarity: milestone.rarity,
                    size: 'sm',
                  }),
                  el('span', { class: 'ft-profile-medals__name', text: milestone.name }),
                ],
              ),
            ),
          )
        : Card({}, EmptyState({
            title: 'No milestones yet',
            message: 'Your first one unlocks the moment you log a post.',
            iconPaths: Icons.medal,
            action: Button({ label: 'Log a post', size: 'sm', onClick: () => navigate('/submit') }),
          })),
    ),

    /* Account */
    Section({ title: 'Account' }, Card({}, [
      el('div', { class: 'ft-stack ft-gap-3' }, [
        el('p', {
          class: 'ft-text-sm ft-text-muted',
          text: 'Need your username, platform, or goal changed? Message the team and we will sort it.',
        }),
        Button({
          label: 'Log out',
          variant: 'secondary',
          block: true,
          iconPaths: Icons.logout,
          onClick: async () => {
            const confirmed = await confirmModal({
              title: 'Log out?',
              message: 'Your streak stays exactly where it is. You will need your PIN to get back in.',
              confirmLabel: 'Log out',
            });

            if (!confirmed) return;

            await call('auth.logout').catch(() => {});
            clearSession();
            navigate('/login', { replace: true });
          },
        }),
      ]),
    ])),
  ]);
}

function Fact(label, value, iconPaths, color) {
  return el('div', { class: 'ft-profile-facts__item' }, [
    el('dt', { class: 'ft-profile-facts__label' }, [
      iconPaths
        ? el('span', { class: 'ft-profile-facts__icon', style: color ? { color } : undefined }, icon(iconPaths))
        : null,
      el('span', { text: label }),
    ]),
    el('dd', { class: 'ft-profile-facts__value', text: value }),
  ]);
}

function Loading() {
  return el('div', { class: 'ft-stack ft-gap-6' }, [
    Card({}, el('div', { class: 'ft-row ft-gap-4' }, [
      Skeleton({ variant: 'circle', width: '5rem', height: '5rem' }),
      el('div', { class: 'ft-grow ft-stack ft-gap-2' }, [
        Skeleton({ variant: 'title', width: '50%' }),
        Skeleton({ variant: 'text', width: '30%' }),
      ]),
    ])),
    el('div', { class: 'ft-grid ft-grid--4' },
      Array.from({ length: 4 }, () => Skeleton({ variant: 'card', height: '5.5rem' }))),
  ]);
}
