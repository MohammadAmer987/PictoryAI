import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ContentStudioHeader from '../../components/history/ContentStudioHeader';
import ContentStudioTabs from '../../components/history/ContentStudioTabs';

function ContentStudioPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('newest');
  const [activeTab, setActiveTab] = useState('images');
  const [imageFilter, setImageFilter] = useState('all');
  const [captionToneFilter, setCaptionToneFilter] = useState('all');
  const [captionLanguageFilter, setCaptionLanguageFilter] = useState('all');

  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('access_token');

        const headers = {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const [captionsResponse, imagesResponse] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/history/captions', { headers }),
          fetch('http://127.0.0.1:8000/api/history/images', { headers }),
        ]);

        const captionsResult = await captionsResponse.json();
        const imagesResult = await imagesResponse.json();

        setCaptions(captionsResult.success ? captionsResult.data : []);
        setImages(imagesResult.success ? imagesResult.data : []);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        setCaptions([]);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDeleteCaptionGroup = async (groupId) => {
    const confirmed = window.confirm('Delete this caption group from history?');

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`http://127.0.0.1:8000/api/history/captions/${groupId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete caption group.');
      }

      setCaptions((current) => current.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error('Failed to delete caption group:', error);
      window.alert('Could not delete this caption group. Please try again.');
    }
  };

  const handleDeleteImageGroup = async (item) => {
    const confirmed = window.confirm('Delete this image group from history?');

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(
        `http://127.0.0.1:8000/api/history/images/${item.type}/${item.request_id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete image group.');
      }

      setImages((current) => current.filter((image) => image.id !== item.id));
    } catch (error) {
      console.error('Failed to delete image group:', error);
      window.alert('Could not delete this image group. Please try again.');
    }
  };

  const getItemDate = (item) => item.date || item.created_at;

  const sortItems = (items) => {
    const sorted = [...items];

    switch (sortValue) {
      case 'oldest':
        return sorted.sort(
            (a, b) => new Date(getItemDate(a)) - new Date(getItemDate(b))
        );

      case 'az':
        return sorted.sort((a, b) =>
            (a.title || '').localeCompare(b.title || '')
        );

      case 'za':
        return sorted.sort((a, b) =>
            (b.title || '').localeCompare(a.title || '')
        );

      case 'newest':
      default:
        return sorted.sort(
            (a, b) => new Date(getItemDate(b)) - new Date(getItemDate(a))
        );
    }
  };

  const filteredImages = sortItems(
      images.filter((item) => {
        const term = searchTerm.toLowerCase();
        const matchesType = imageFilter === 'all' || item.type === imageFilter;

        const matchesSearch = (
            item.title?.toLowerCase().includes(term) ||
            item.type?.toLowerCase().includes(term) ||
            item.details?.theme?.toLowerCase().includes(term) ||
            item.details?.project_name?.toLowerCase().includes(term) ||
            item.details?.content?.toLowerCase().includes(term) ||
            item.details?.style_type?.toLowerCase().includes(term)
        );

        return matchesType && matchesSearch;
      })
  );

  const filteredCaptions = sortItems(
      captions.filter((item) => {
        const term = searchTerm.toLowerCase();
        const matchesTone =
            captionToneFilter === 'all' ||
            item.tone?.toLowerCase() === captionToneFilter;
        const matchesLanguage =
            captionLanguageFilter === 'all' ||
            item.language?.toLowerCase() === captionLanguageFilter;

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

        return matchesTone && matchesLanguage && (matchesMainFields || matchesCaptionItems);
      })
  );

  return (
      <div className="pb-3">
        <ContentStudioHeader
            activeTab={activeTab}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortValue={sortValue}
            onSortChange={setSortValue}
            imageFilter={imageFilter}
            onImageFilterChange={setImageFilter}
            captionToneFilter={captionToneFilter}
            onCaptionToneFilterChange={setCaptionToneFilter}
            captionLanguageFilter={captionLanguageFilter}
            onCaptionLanguageFilterChange={setCaptionLanguageFilter}
            totalImages={images.length}
            totalCaptions={captions.length}
        />

        {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status"></div>
              <p className="mt-3 text-secondary">Loading history...</p>
            </div>
        ) : (
            <ContentStudioTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                images={filteredImages}
                captions={filteredCaptions}
                onDeleteImageGroup={handleDeleteImageGroup}
                onDeleteCaptionGroup={handleDeleteCaptionGroup}
            />
        )}
      </div>
  );
}

export default ContentStudioPage;
