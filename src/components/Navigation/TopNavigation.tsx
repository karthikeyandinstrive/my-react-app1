import './TopNavigation.css';

export type TabType = 'home' | 'insert' | 'design' | 'transitions' | 'animations' | 'slideshow' | 'review' | 'view';

interface TopNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  presentationTitle?: string;
}

function TopNavigation({ activeTab, onTabChange, presentationTitle }: TopNavigationProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'insert', label: 'Insert' },
    { id: 'design', label: 'Design' },
    { id: 'transitions', label: 'Transitions' },
    { id: 'animations', label: 'Animations' },
    { id: 'slideshow', label: 'Slide Show' },
    { id: 'review', label: 'Review' },
    { id: 'view', label: 'View' },
  ];

  return (
    <div className="top-navigation">
      <div className="top-nav-header">
        <div className="app-title">Slide Master</div>
        {presentationTitle && <div className="presentation-title">{presentationTitle}</div>}
      </div>
      <div className="top-nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TopNavigation;
