import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import ImagesGrid from './ImagesGrid';
import CaptionsList from './CaptionsList';

function ContentStudioTabs({
                             activeTab = 'images',
                             onTabChange,
                             images = [],
                             captions = [],
                             onDeleteImageGroup,
                             onDeleteCaptionGroup,
                           }) {
  const [displayTab, setDisplayTab] = useState(activeTab);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (activeTab === displayTab) return;

    setIsVisible(false);

    const timeout = setTimeout(() => {
      setDisplayTab(activeTab);
      setIsVisible(true);
    }, 180);

    return () => clearTimeout(timeout);
  }, [activeTab, displayTab]);

  return (
      <Container className="mt-4">
        <div className="studio-tabs-wrapper">
          <button
              type="button"
              className={`studio-tab-btn ${activeTab === 'images' ? 'active' : ''}`}
              onClick={() => onTabChange('images')}
          >
            <i className="bi bi-images me-2"></i>
            Images
            <span className="studio-tab-count">{images.length}</span>
          </button>

          <button
              type="button"
              className={`studio-tab-btn ${activeTab === 'captions' ? 'active' : ''}`}
              onClick={() => onTabChange('captions')}
          >
            <i className="bi bi-card-text me-2"></i>
            Captions
            <span className="studio-tab-count">{captions.length}</span>
          </button>
        </div>

        <div
            className={`studio-tab-content mt-4 ${
                isVisible ? 'studio-tab-content-enter' : 'studio-tab-content-exit'
            }`}
        >
          {displayTab === 'images' ? (
              <ImagesGrid
                  images={images}
                  onDeleteGroup={onDeleteImageGroup}
              />
          ) : (
              <CaptionsList
                  captions={captions}
                  onDeleteGroup={onDeleteCaptionGroup}
              />
          )}
        </div>
      </Container>
  );
}

export default ContentStudioTabs;
