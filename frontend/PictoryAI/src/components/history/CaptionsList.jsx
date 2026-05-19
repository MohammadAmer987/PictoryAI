import { useState } from 'react';
import { Button } from 'react-bootstrap';

function CaptionsList({ captions = [], onDeleteGroup }) {
    const [openId, setOpenId] = useState(null);
    const [copiedKey, setCopiedKey] = useState('');

    const isRtlText = (text = '') => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);

    const toggleOpen = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    const handleCopy = async (text, key) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);

            setTimeout(() => {
                setCopiedKey('');
            }, 1500);
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    const handleCopyAll = async (items, key) => {
        try {
            const allText = items
                .map((item) => `${item.type}\n${item.text}`)
                .join('\n\n');

            await navigator.clipboard.writeText(allText);
            setCopiedKey(key);

            setTimeout(() => {
                setCopiedKey('');
            }, 1500);
        } catch (error) {
            console.error('Copy all failed:', error);
        }
    };

    const getToneClass = (tone) => {
        const value = tone.toLowerCase();

        if (value === 'funny') return 'studio-tag tone-funny';
        if (value === 'friendly') return 'studio-tag tone-friendly';
        if (value === 'luxury') return 'studio-tag tone-luxury';
        return 'studio-tag';
    };

    const getCaptionCardClass = (type) => {
        const value = type.toLowerCase();

        if (value === 'promotional') return 'studio-caption-variant promotional';
        if (value === 'luxury') return 'studio-caption-variant luxury';
        if (value === 'friendly') return 'studio-caption-variant friendly';
        return 'studio-caption-variant short';
    };

    if (captions.length === 0) {
        return (
            <div className="studio-empty-state text-center py-5">
                <i className="bi bi-card-text fs-1 mb-3 d-block"></i>
                <h5 className="hero-title">No captions found</h5>
                <p className="text-secondary mb-0">Try a different search term.</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-3">
            {captions.map((group) => {
                const isOpen = openId === group.id;

                return (
                    <div
                        key={group.id}
                        className={`studio-caption-group ${isOpen ? 'open' : ''}`}
                    >
                        <button
                            type="button"
                            className="studio-caption-group-header"
                            onClick={() => toggleOpen(group.id)}
                        >
                            <div className="studio-caption-group-left">
                                <div className="studio-caption-group-icon">
                                    <i className="bi bi-card-image"></i>
                                </div>

                                <div className="studio-caption-group-meta">
                                    <div className="studio-caption-group-title-row">
                                        <h5 className="studio-caption-group-title mb-0">
                                            {group.title}
                                        </h5>

                                        <span className="studio-caption-count-badge">
                      {group.items.length} captions
                    </span>
                                    </div>

                                    <div className="studio-caption-group-submeta">
                    <span className="studio-caption-date">
                      <i className="bi bi-calendar-event me-1"></i>
                        {group.date}
                    </span>

                                        <span className={getToneClass(group.tone)}>
                      {group.tone}
                    </span>

                                        <span className="studio-tag language">
                      {group.language}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="studio-caption-group-actions">
                                <button
                                    type="button"
                                    className="studio-caption-delete-btn"
                                    title="Delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onDeleteGroup) {
                                            onDeleteGroup(group.id);
                                        }
                                    }}
                                >
                                    <i className="bi bi-trash3"></i>
                                </button>

                                <div className="studio-caption-expand-icon">
                                    <i
                                        className={`bi ${
                                            isOpen ? 'bi-chevron-up' : 'bi-chevron-down'
                                        }`}
                                    ></i>
                                </div>
                            </div>
                        </button>

                        {isOpen && (
                            <div className="studio-caption-group-body">
                                <div className="studio-caption-grid">
                                    {group.items.map((item, index) => {
                                        const key = `${group.id}-${index}`;
                                        const isRtl = isRtlText(item.text);

                                        return (
                                            <div
                                                key={key}
                                                className={getCaptionCardClass(item.type)}
                                            >
                                                <div className="studio-caption-variant-header">
                          <span className="studio-caption-type">
                            {item.type.toUpperCase()}
                          </span>

                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="studio-copy-btn"
                                                        onClick={() => handleCopy(item.text, key)}
                                                    >
                                                        <i className="bi bi-copy me-1"></i>
                                                        {copiedKey === key ? 'Copied' : 'Copy'}
                                                    </Button>
                                                </div>

                                                <p
                                                    className="studio-caption-variant-text mb-0"
                                                    dir={isRtl ? 'rtl' : 'ltr'}
                                                    style={{ textAlign: isRtl ? 'right' : 'left' }}
                                                >
                                                    {item.text}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="d-flex justify-content-end mt-3">
                                    <Button
                                        className="studio-copy-all-btn"
                                        onClick={() =>
                                            handleCopyAll(group.items, `all-${group.id}`)
                                        }
                                    >
                                        <i className="bi bi-copy me-2"></i>
                                        {copiedKey === `all-${group.id}` ? 'Copied All' : 'Copy All'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default CaptionsList;
