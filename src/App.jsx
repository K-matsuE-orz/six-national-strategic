import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Stock Name Mapping (Ticker -> Japanese Name)
const STOCK_NAMES = {
    // AI・ロボット
    "9984.T": "ソフトバンクG", "6861.T": "キーエンス", "6954.T": "ファナック", "6273.T": "SMC", "6645.T": "オムロン",
    "3993.T": "PKSHA", "4180.T": "Appier", "247A.T": "Aiロボティクス", "4382.T": "HEROZ", "4011.T": "ヘッドウォータース",
    // 量子技術
    "6702.T": "富士通", "6701.T": "NEC", "9432.T": "NTT", "6501.T": "日立製作所", "6503.T": "三菱電機",
    "3687.T": "フィックスターズ", "6597.T": "HPCシステムズ", "6521.T": "オキサイド", "7713.T": "シグマ光機", "2693.T": "YKT",
    // 半導体・通信
    "8035.T": "東京エレクトロン", "6857.T": "アドバンテスト", "4063.T": "信越化学", "6146.T": "ディスコ", "6920.T": "レーザーテック",
    "6323.T": "ローツェ", "6315.T": "TOWA", "4369.T": "トリケミカル", "6871.T": "日本マイクロニクス", "6266.T": "タツモ",
    // バイオ・ヘルスケア
    "4519.T": "中外製薬", "4568.T": "第一三共", "4502.T": "武田薬品", "4578.T": "大塚HD", "4503.T": "アステラス製薬",
    "4587.T": "ペプチドリーム", "2160.T": "GNIグループ", "4552.T": "JCRファーマ", "4592.T": "サンバイオ", "4599.T": "ステムリム",
    // 核融合
    "7013.T": "IHI", "5802.T": "住友電気工業", "5803.T": "フジクラ", "5801.T": "古河電気工業", "1963.T": "日揮HD",
    "5310.T": "東洋炭素", "7711.T": "助川電気工業", "3446.T": "ジェイテック", "6378.T": "木村化工機", "6864.T": "エヌエフHD",
    // 宇宙
    "7011.T": "三菱重工業", "7012.T": "川崎重工業", "9412.T": "スカパーJSAT", "7751.T": "キヤノン", "9433.T": "KDDI",
    "9348.T": "ispace", "5595.T": "QPS研究所", "186A.T": "アストロスケール", "290A.T": "Synspective", "402A.T": "アクセルスペース"
};

const INITIAL_DATA = {
    "AI_Robot": { name: "AI・ロボット", change: 0, tickers: [] },
    "Quantum": { name: "量子技術", change: 0, tickers: [] },
    "Semi": { name: "半導体・通信", change: 0, tickers: [] },
    "Bio": { name: "バイオ・ヘルスケア", change: 0, tickers: [] },
    "Fusion": { name: "核融合", change: 0, tickers: [] },
    "Space": { name: "宇宙", change: 0, tickers: [] }
};

function App() {
    const [data, setData] = useState(INITIAL_DATA);
    const [historyData, setHistoryData] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try production path first, then local
                let res = await fetch('/sector-voting-game/stock_data.json');
                if (!res.ok) res = await fetch('/stock_data.json');

                const json = await res.json();
                if (json.sectors) {
                    setData(prev => {
                        const newData = { ...prev };
                        Object.keys(json.sectors).forEach(key => {
                            if (newData[key]) {
                                newData[key].change = json.sectors[key].change_percent;
                                newData[key].tickers = json.sectors[key].tickers || [];
                            }
                        });
                        return newData;
                    });
                }
                if (json.history) {
                    setHistoryData(json.history);
                }
            } catch (err) {
                console.error("Failed to load stock data", err);
            }
        };
        fetchData();
    }, []);

    const chartData = Object.keys(data).map(key => ({
        name: data[key].name,
        Growth: data[key].change,
    }));

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                国家戦略技術：市場パフォーマンス
            </h1>

            <p className="mb-12 text-center text-gray-300 text-lg">
                6つの戦略分野の直近騰落率と、構成銘柄の動向をチェック！
            </p>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                {Object.entries(data).map(([key, info]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedSector(key)}
                        className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 group text-left relative overflow-hidden
                            ${selectedSector === key ? 'bg-gray-800 border-blue-500 ring-2 ring-blue-500' : 'bg-gray-800 border-gray-700 hover:border-gray-500'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">{info.name}</h3>
                                <div className="text-4xl mt-2">
                                    {key === 'AI_Robot' && '🤖'}
                                    {key === 'Quantum' && '⚛️'}
                                    {key === 'Semi' && '📱'}
                                    {key === 'Bio' && '💊'}
                                    {key === 'Fusion' && '☀️'}
                                    {key === 'Space' && '🚀'}
                                </div>
                            </div>
                            <div className={`text-3xl font-bold ${info.change > 0 ? 'text-red-400' : info.change < 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                {info.change > 0 ? '+' : ''}{info.change}%
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">クリックして銘柄一覧を表示</p>
                    </button>
                ))}
            </div>

            {/* Detail View (Modal Overlay) */}
            {selectedSector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedSector(null)}>
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                            <h2 className="text-3xl font-bold text-blue-400">
                                {data[selectedSector].name} 銘柄一覧
                            </h2>
                            <button
                                onClick={() => setSelectedSector(null)}
                                className="text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Large Cap Section */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-300 mb-4 border-l-4 border-blue-500 pl-3">
                                    大型株 (Large Cap)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data[selectedSector].tickers.slice(0, 5).map((stock) => {
                                        const isObject = typeof stock === 'object' && stock !== null;
                                        const ticker = isObject ? stock.ticker : stock;
                                        const change = isObject ? stock.change : null;
                                        const price = isObject ? stock.price : null;

                                        return (
                                            <a
                                                key={ticker}
                                                href={`https://finance.yahoo.co.jp/quote/${ticker}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
                                            >
                                                <div>
                                                    <div className="font-bold text-lg group-hover:text-blue-300 transition-colors">
                                                        {STOCK_NAMES[ticker] || ticker}
                                                        <span className="ml-2 text-xs text-gray-500">🔗</span>
                                                    </div>
                                                    <div className="text-sm text-gray-400">{ticker}</div>
                                                </div>
                                                <div className="text-right">
                                                    {price !== null ? (
                                                        <>
                                                            <div className={`font-bold text-lg ${change > 0 ? 'text-red-400' : change < 0 ? 'text-green-400' : 'text-gray-300'}`}>
                                                                {change > 0 ? '+' : ''}{change}%
                                                            </div>
                                                            <div className="text-sm text-gray-300">¥{price.toLocaleString()}</div>
                                                        </>
                                                    ) : (
                                                        <div className="text-gray-400 text-sm">データ更新待ち</div>
                                                    )}
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Small/Mid Cap Section */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-300 mb-4 border-l-4 border-purple-500 pl-3">
                                    中小型株 (Small/Mid Cap)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data[selectedSector].tickers.slice(5, 10).map((stock) => {
                                        const isObject = typeof stock === 'object' && stock !== null;
                                        const ticker = isObject ? stock.ticker : stock;
                                        const change = isObject ? stock.change : null;
                                        const price = isObject ? stock.price : null;

                                        return (
                                            <a
                                                key={ticker}
                                                href={`https://finance.yahoo.co.jp/quote/${ticker}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
                                            >
                                                <div>
                                                    <div className="font-bold text-lg group-hover:text-blue-300 transition-colors">
                                                        {STOCK_NAMES[ticker] || ticker}
                                                        <span className="ml-2 text-xs text-gray-500">🔗</span>
                                                    </div>
                                                    <div className="text-sm text-gray-400">{ticker}</div>
                                                </div>
                                                <div className="text-right">
                                                    {price !== null ? (
                                                        <>
                                                            <div className={`font-bold text-lg ${change > 0 ? 'text-red-400' : change < 0 ? 'text-green-400' : 'text-gray-300'}`}>
                                                                {change > 0 ? '+' : ''}{change}%
                                                            </div>
                                                            <div className="text-sm text-gray-300">¥{price.toLocaleString()}</div>
                                                        </>
                                                    ) : (
                                                        <div className="text-gray-400 text-sm">データ更新待ち</div>
                                                    )}
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-12">
                {/* Bar Chart (Daily Change) */}
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">セクター別 平均騰落率 (前日比)</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" stroke="#ccc" fontSize={12} interval={0} angle={-45} textAnchor="end" height={80} />
                                <YAxis stroke="#ccc" label={{ value: '騰落率 (%)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="Growth" fill="#8884d8" name="平均騰落率" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart (1-Year Trend) */}
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">過去1年間の推移 (セクター別)</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#ccc"
                                    fontSize={12}
                                    tickFormatter={(str) => {
                                        const d = new Date(str);
                                        return `${d.getMonth() + 1}/${d.getDate()}`;
                                    }}
                                    interval={30}
                                />
                                <YAxis stroke="#ccc" label={{ value: '変化率 (%)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Legend />
                                {/* News Annotation Line */}
                                <ReferenceLine x={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} stroke="red" label="減税報道" strokeDasharray="3 3" />

                                <Line type="monotone" dataKey="AI_Robot" stroke="#3b82f6" dot={false} name="AI・ロボ" />
                                <Line type="monotone" dataKey="Quantum" stroke="#8b5cf6" dot={false} name="量子" />
                                <Line type="monotone" dataKey="Semi" stroke="#10b981" dot={false} name="半導体" />
                                <Line type="monotone" dataKey="Bio" stroke="#ec4899" dot={false} name="バイオ" />
                                <Line type="monotone" dataKey="Fusion" stroke="#f59e0b" dot={false} name="核融合" />
                                <Line type="monotone" dataKey="Space" stroke="#6366f1" dot={false} name="宇宙" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-right">※1年前を0%とした変化率</p>
                </div>
            </div>
        </div>
    )
}

export default App
