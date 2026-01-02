import React from 'react';

const HistoryList = ({ history }) => {
    if (!history || history.length === 0) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="history-list" style={{ marginTop: '30px' }}>
            <h3>Version History</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ver</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>AI Model</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Optimized Title</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((version) => (
                        <tr key={version.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{version.version_number}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatDate(version.created_at)}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{version.ai_model_used}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {version.optimized_title ? version.optimized_title.substring(0, 50) + '...' : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryList;
