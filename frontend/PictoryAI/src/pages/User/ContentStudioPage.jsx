import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ContentStudioHeader from '../../components/history/ContentStudioHeader';
import ContentStudioTabs from '../../components/history/ContentStudioTabs';

function ContentStudioPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('newest');
  const [activeTab, setActiveTab] = useState('captions');

  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCaptionsHistory = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('access_token');

        const response = await fetch(
            'http://127.0.0.1:8000/api/history/captions',
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
        );

        const result = await response.json();

        if (result.success) {
          setCaptions(result.data);
        } else {
          setCaptions([]);
        }
      } catch (error) {
        console.error('Failed to fetch captions history:', error);
        setCaptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptionsHistory();
  }, []);





  const sortItems = (items) => {
    const sorted = [...items];

    switch (sortValue) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));

      case 'az':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));

      case 'za':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));

      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  const filteredImages = sortItems(
      images.filter((item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const filteredCaptions = sortItems(
      captions.filter((item) => {
        const term = searchTerm.toLowerCase();

        const matchesMainFields =
            item.title?.toLowerCase().includes(term) ||
            item.tone?.toLowerCase().includes(term) ||
            item.language?.toLowerCase().includes(term);

        const matchesCaptionItems = item.items?.some((caption) => {
          return (
              caption.type?.toLowerCase().includes(term) ||
              caption.text?.toLowerCase().includes(term)
          );
        });

        return matchesMainFields || matchesCaptionItems;
      })
  );

  return (
      <div className="pb-3">
        <ContentStudioHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortValue={sortValue}
            onSortChange={setSortValue}
            totalImages={images.length}
            totalCaptions={captions.length}
        />

        {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status"></div>
              <p className="mt-3 text-secondary">Loading captions...</p>
            </div>
        ) : (
            <ContentStudioTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                images={filteredImages}
                captions={filteredCaptions}
            />
        )}

        <div className="studio-upgrade-banner mt-4 mb-4 pt-7">
          <div className="studio-upgrade-content">
            <div className="studio-upgrade-icon">
              <i className="bi bi-stars"></i>
            </div>

            <div className="studio-upgrade-text">
              <span className="studio-upgrade-badge">Upgrade to Pro</span>
              <h5 className="mb-2">Unlock up to 100 saved creations</h5>
              <p className="mb-0">
                Upgrade your plan to save more images and captions, remove limits,
                and enjoy a smoother content workflow.
              </p>
            </div>

            <button
                className="studio-upgrade-btn"
                onClick={() => navigate('/pricing')}
            >
              Subscribe Now
              <i className="bi bi-arrow-right-short ms-1"></i>
            </button>
          </div>
        </div>
      </div>
  );
}

export default ContentStudioPage;