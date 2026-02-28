import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import styles from './Organization.module.css';

interface Organization {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  focus: string[];
  volunteers: number;
  rating: number;
  events: Event[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  volunteers: number;
  impact: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const mockOrganizations: Organization[] = [
  {
    id: 'org-001',
    name: 'Food Bank Network',
    logo: '🍽️',
    description: 'Fighting hunger and food insecurity in our community',
    location: 'San Francisco, CA',
    focus: ['Poverty & Hunger', 'Community Development'],
    volunteers: 1243,
    rating: 4.8,
    events: [
      {
        id: 'evt-001',
        title: 'Weekend Food Drive',
        date: '2024-03-22',
        location: 'Downtown SF',
        volunteers: 67,
        impact: '2,500 meals distributed',
        status: 'upcoming',
      },
      {
        id: 'evt-002',
        title: 'Warehouse Organization',
        date: '2024-03-15',
        location: 'SF Warehouse',
        volunteers: 45,
        impact: '10,000 items sorted',
        status: 'completed',
      },
    ],
  },
  {
    id: 'org-002',
    name: 'Climate Action Now',
    logo: '🌍',
    description: 'Building a sustainable future through community action',
    location: 'Bay Area, CA',
    focus: ['Environment & Climate', 'Governance & Civic'],
    volunteers: 856,
    rating: 4.6,
    events: [
      {
        id: 'evt-003',
        title: 'Tree Planting Initiative',
        date: '2024-03-20',
        location: 'Various Parks',
        volunteers: 120,
        impact: '500 trees planted',
        status: 'upcoming',
      },
      {
        id: 'evt-004',
        title: 'Carbon Audit Workshop',
        date: '2024-03-10',
        location: 'San Francisco',
        volunteers: 32,
        impact: '150 businesses audited',
        status: 'ongoing',
      },
    ],
  },
  {
    id: 'org-003',
    name: 'Education Empowers',
    logo: '📚',
    description: 'Providing quality education and mentorship to underserved youth',
    location: 'Oakland, CA',
    focus: ['Education & Youth'],
    volunteers: 634,
    rating: 4.7,
    events: [
      {
        id: 'evt-005',
        title: 'Summer Tutoring Program',
        date: '2024-06-01',
        location: 'Oakland Schools',
        volunteers: 200,
        impact: '500 students supported',
        status: 'upcoming',
      },
      {
        id: 'evt-006',
        title: 'Mentorship Kickoff',
        date: '2024-02-28',
        location: 'Oakland Community Center',
        volunteers: 89,
        impact: '89 mentor-student pairs',
        status: 'completed',
      },
    ],
  },
  {
    id: 'org-004',
    name: 'Tech for Good',
    logo: '💻',
    description: 'Leveraging technology to solve social problems',
    location: 'San Francisco, CA',
    focus: ['Technology & Innovation', 'Education & Youth'],
    volunteers: 456,
    rating: 4.5,
    events: [
      {
        id: 'evt-007',
        title: 'Coding Bootcamp for Seniors',
        date: '2024-04-01',
        location: 'San Francisco',
        volunteers: 78,
        impact: '150 seniors upskilled',
        status: 'upcoming',
      },
    ],
  },
];

const Organization: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFocus, setFilterFocus] = useState<string>('');

  const filteredOrganizations = mockOrganizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFocus = filterFocus === '' || org.focus.includes(filterFocus);
    return matchesSearch && matchesFocus;
  });

  const allFocusAreas = [...new Set(mockOrganizations.flatMap((org) => org.focus))];

  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div className={styles.header} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Organization Network</h1>
        <p>Discover and connect with organizations making impact</p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div className={styles.controlsSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${filterFocus === '' ? styles.active : ''}`}
            onClick={() => setFilterFocus('')}
          >
            All
          </button>
          {allFocusAreas.slice(0, 4).map((focus) => (
            <button
              key={focus}
              className={`${styles.filterBtn} ${filterFocus === focus ? styles.active : ''}`}
              onClick={() => setFilterFocus(focus)}
            >
              {focus.split(' & ')[0]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={styles.contentGrid}>
        {/* Organizations List */}
        <motion.div className={styles.organizationsList} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Featured Organizations ({filteredOrganizations.length})</h2>

          <div className={styles.orgsGrid}>
            {filteredOrganizations.map((org, idx) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  className={`${styles.orgCard} ${selectedOrg?.id === org.id ? styles.selected : ''}`}
                  onClick={() => setSelectedOrg(org)}
                >
                  <div className={styles.orgHeader}>
                    <span className={styles.logo}>{org.logo}</span>
                    <div className={styles.headerInfo}>
                      <h3>{org.name}</h3>
                      <div className={styles.rating}>
                        {'⭐'.repeat(Math.floor(org.rating))} {org.rating}
                      </div>
                    </div>
                  </div>

                  <p className={styles.orgDescription}>{org.description}</p>

                  <div className={styles.orgStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Volunteers</span>
                      <span className={styles.statValue}>{org.volunteers}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Events</span>
                      <span className={styles.statValue}>{org.events.length}</span>
                    </div>
                  </div>

                  <div className={styles.focusAreas}>
                    {org.focus.slice(0, 2).map((f) => (
                      <Badge key={f} variant="secondary">
                        {f}
                      </Badge>
                    ))}
                  </div>

                  <div className={styles.location}>📍 {org.location}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Organization Details Sidebar */}
        {selectedOrg && (
          <motion.div
            className={styles.detailsSidebar}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <div className={styles.detailsHeader}>
                <span className={styles.detailsLogo}>{selectedOrg.logo}</span>
                <h2>{selectedOrg.name}</h2>
              </div>

              <p className={styles.detailsDescription}>{selectedOrg.description}</p>

              <div className={styles.detailsStats}>
                <div className={styles.detailsStat}>
                  <span>Total Volunteers</span>
                  <span className={styles.largeStat}>{selectedOrg.volunteers}</span>
                </div>
                <div className={styles.detailsStat}>
                  <span>Organization Rating</span>
                  <span className={styles.largeStat}>{selectedOrg.rating} ⭐</span>
                </div>
              </div>

              <div className={styles.focusAreasDetail}>
                <h3>Focus Areas</h3>
                <div className={styles.focusList}>
                  {selectedOrg.focus.map((f) => (
                    <Badge key={f} variant="primary">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className={styles.upcomingEvents}>
                <h3>Upcoming Events</h3>

                {selectedOrg.events
                  .filter((e) => e.status === 'upcoming')
                  .map((event) => (
                    <div key={event.id} className={styles.eventItem}>
                      <div className={styles.eventDate}>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className={styles.eventDetails}>
                        <h4>{event.title}</h4>
                        <p className={styles.eventLocation}>📍 {event.location}</p>
                        <p className={styles.eventImpact}>🎯 {event.impact}</p>
                      </div>
                    </div>
                  ))}

                {selectedOrg.events.filter((e) => e.status === 'upcoming').length === 0 && (
                  <p className={styles.noEvents}>No upcoming events scheduled</p>
                )}
              </div>

              <div className={styles.pastEvents}>
                <h3>Completed Events</h3>

                {selectedOrg.events
                  .filter((e) => e.status === 'completed')
                  .slice(0, 2)
                  .map((event) => (
                    <div key={event.id} className={styles.pastEventItem}>
                      <span className={styles.eventTitle}>{event.title}</span>
                      <span className={styles.eventBadge}>✓ Completed</span>
                    </div>
                  ))}
              </div>

              <Button variant="primary" className={styles.actionButton}>
                Join This Organization
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Organization;
