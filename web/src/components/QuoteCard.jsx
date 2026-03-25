import './QuoteCard.css';

// Gradient palette for variety
const gradients = [
    'linear-gradient(135deg, rgba(124, 92, 252, 0.15) 0%, rgba(192, 132, 252, 0.08) 100%)',
    'linear-gradient(135deg, rgba(244, 114, 182, 0.15) 0%, rgba(251, 191, 36, 0.08) 100%)',
    'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(34, 211, 238, 0.08) 100%)',
    'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(244, 114, 182, 0.08) 100%)',
    'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(124, 92, 252, 0.08) 100%)',
];

const accentColors = ['#7c5cfc', '#f472b6', '#4ade80', '#fbbf24', '#22d3ee'];

function QuoteCard({ quote, index = 0 }) {
    const gradient = gradients[index % gradients.length];
    const accent = accentColors[index % accentColors.length];

    return (
        <div
            className="quote-card glass-card"
            style={{
                background: gradient,
                animationDelay: `${index * 0.08}s`,
            }}
        >
            <div className="quote-mark" style={{ color: accent }}>❝</div>
            <p className="quote-text">{quote.text}</p>
            {quote.author && (
                <p className="quote-author">
                    <span className="quote-dash" style={{ background: accent }} />
                    {quote.author}
                </p>
            )}
        </div>
    );
}

export default QuoteCard;
