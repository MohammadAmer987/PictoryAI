import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentStudioHeader from '../../components/history/ContentStudioHeader';
import ContentStudioTabs from '../../components/history/ContentStudioTabs';

function ContentStudioPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('newest');
  const [activeTab, setActiveTab] = useState('images');

  const images = [
    {
      id: 1,
      title: 'Luxury Perfume',
      date: '2026-03-26',
      image:
          'https://public.readdy.ai/ai/img_res/82e5f16e5fd8563db999f5172681577c.jpg',
    },
    {
      id: 2,
      title: 'Skincare Cream',
      date: '2026-03-25',
      image:
          'https://public.readdy.ai/ai/img_res/df5453ce4620748905eda45e661c36cc.jpg',
    },
    {
      id: 3,
      title: 'Designer Handbag',
      date: '2026-03-24',
      image:
          'https://public.readdy.ai/ai/img_res/47e074084f622cb7976a9191d2236ff7.jpg',
    },
  ];

  const captions = [
    {
      id: 1,
      title: 'Luxury Perfume — Ramadan Edition',
      tone: 'Luxury',
      language: 'English',
      date: '2026-04-05',
      items: [
        {
          type: 'Short',
          text: 'Elevate your senses with every drop. ✨',
        },
        {
          type: 'Promotional',
          text: 'Discover a refined fragrance crafted to leave a lasting impression with every moment.',
        },
        {
          type: 'Friendly',
          text: 'Looking for a scent that feels elegant and unforgettable? This one is made for you 💫',
        },
        {
          type: 'Luxury',
          text: 'A fragrance designed for timeless elegance, depth, and pure sophistication.',
        },
      ],
    },
    {
      id: 2,
      title: 'Organic Face Serum',
      tone: 'Professional',
      language: 'English',
      date: '2026-04-04',
      items: [
        {
          type: 'Short',
          text: 'Healthy glow starts here.',
        },
        {
          type: 'Promotional',
          text: 'Give your skin the care it deserves with a serum designed to nourish, hydrate, and restore radiance.',
        },
        {
          type: 'Friendly',
          text: 'Your skincare routine just found its new favorite step 🌿',
        },
        {
          type: 'Luxury',
          text: 'A premium serum crafted to enhance radiance with a refined, lightweight formula.',
        },
      ],
    },
    {
      id: 3,
      title: 'كريم العناية الصيفي',
      tone: 'Friendly',
      language: 'Arabic',
      date: '2026-04-03',
      items: [
        {
          type: 'Short',
          text: 'بشرتك تستحق الأفضل هذا الصيف! 🌿',
        },
        {
          type: 'Promotional',
          text: 'تركيبة خفيفة ومنعشة تمنح بشرتك ترطيبًا ونعومة تدوم طوال اليوم.',
        },
        {
          type: 'Friendly',
          text: 'خلي بشرتك مرتاحة ومنتعشة بكل طلعة ☀️',
        },
        {
          type: 'Luxury',
          text: 'عناية فاخرة تمنح بشرتك إشراقة ناعمة ولمسة راقية في كل استخدام.',
        },
      ],
    },
  ];

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
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const filteredCaptions = sortItems(
      captions.filter((item) => {
        const term = searchTerm.toLowerCase();

        const matchesMainFields =
            item.title.toLowerCase().includes(term) ||
            item.tone.toLowerCase().includes(term) ||
            item.language.toLowerCase().includes(term);

        const matchesCaptionText = item.items.some((caption) =>
            caption.text.toLowerCase().includes(term)
        );

        return matchesMainFields || matchesCaptionText;
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



        <ContentStudioTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            images={filteredImages}
            captions={filteredCaptions}
        />




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