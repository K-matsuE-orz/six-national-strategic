import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for initial render (will be replaced by fetched data)
const INITIAL_DATA = {
    "AI_Robot": { name: "AI・ロボット", change: 0, votes: 0 },
    "Quantum": { name: "量子技術", change: 0, votes: 0 },
    "Semi": { name: "半導体・通信", change: 0, votes: 0 },
    "Bio": { name: "バイオ・ヘルスケア", change: 0, votes: 0 },
    "Fusion": { name: "核融合", change: 0, votes: 0 },
    "Space": { name: "宇宙", change: 0, votes: 0 }
};

// Mapping of tickers to Japanese company names
const TICKER_NAMES = {
    "9984.T": "ソフトバンクG", "6861.T": "キーエンス", "6954.T": "ファナック", "6273.T": "SMC", "6645.T": "オムロン",
    "3993.T": "PKSHA", "4180.T": "Appier", "247A.T": "Aiロボティクス", "4382.T": "HEROZ", "4011.T": "ヘッドウォータース",
    "6702.T": "富士通", "6701.T": "NEC", "9432.T": "NTT", "6501.T": "日立製作所", "6503.T": "三菱電機",
    "3687.T": "フィックスターズ", "6597.T": "HPCシステムズ", "6521.T": "オキサイド", "7713.T": "シグマ光機", "2693.T": "YKT",
    "8035.T": "東エレク", "6857.T": "アドバンテスト", "4063.T": "信越化学", "6146.T": "ディスコ", "6920.T": "レーザーテック",
    "6323.T": "ローツェ", "6315.T": "TOWA", "4369.T": "トリケミカル", "6871.T": "日本マイクロ", "6266.T": "タツモ",
    "4519.T": "中外製薬", "4568.T": "第一三共", "4502.T": "武田薬品", "4578.T": "大塚HD", "4503.T": "アステラス",
    "4587.T": "ペプチドリーム", "2160.T": "GNI", "4552.T": "JCRファーマ", "4592.T": "サンバイオ", "4599.T": "ステムリム",
    "7013.T": "IHI", "5802.T": "住友電工", "5803.T": "フジクラ", "5801.T": "古河電工", "1963.T": "日揮HD",
    "5310.T": "東洋炭素", "7711.T": "助川電気", "3446.T": "ジェイテック", "6378.T": "木村化工機", "6864.T": "エヌエフHD",
    "7011.T": "三菱重工", "7012.T": "川崎重工", "9412.T": "スカパーJSAT", "7751.T": "キヤノン", "9433.T": "KDDI",
    "9348.T": "ispace", "5595.T": "QPS研究所", "186A.T": "アストロスケール", "290A.T": "Synspective", "402A.T": "アクセルスペース"
};

function App() {
    const [data, setData] = useState(INITIAL_DATA);
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedSector, setSelectedSector] = useState(null);

    useEffect(() => {
        // Fetch stock data from public/stock_data.json
        // Try with base path first (production), then fallback to relative (local)
        const fetchData = async () => {
            try {
                const res = await fetch('/sector-voting-game/stock_data.json');
                if (!res.ok) throw new Error('Not found');
                const json = await res.json();
                updateData(json);
            } catch (err) {
                try {
                    const res = await fetch('/stock_data.json');
                    const json = await res.json();
                    updateData(json);
                } catch (e) {
                    console.error("Failed to load stock data", e);
                }
            }
        };

        const updateData = (json) => {
            if (json.sectors) {
                setData(prev => {
                    const newData = { ...prev };
                    Object.keys(json.sectors).forEach(key => {
                        if (newData[key]) {
                            newData[key].change = json.sectors[key].change_percent;
                            // Store tickers data if available
                            if (json.sectors[key].tickers) {
                                newData[key].tickers = json.sectors[key].tickers;
                            }
                        }
                    });
                    return newData;
                });
            }
        };

        fetchData();
    }, []);

    const handleVote = (sectorKey) => {
        if (hasVoted) return;
        setSelectedSector(sectorKey);
        setHasVoted(true);
        console.log(`Voted for ${sectorKey}`);

        // Optimistic update for demo
        setData(prev => ({
            ...prev,
            [sectorKey]: { ...prev[sectorKey], votes: prev[sectorKey].votes + 1 }
        }));
    };

    const chartData = Object.keys(data).map(key => ({
        name: data[key].name,
        Growth: data[key].change,
        Votes: data[key].votes
    }));

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                国家戦略技術：未来予測投票
            </h1>

            <p className="mb-8 text-gray-300 text-lg">
                6つの戦略分野、どれが一番伸びる？<br />
                あなたの予想と、実際の市場パフォーマンス（直近騰落率）を比較しよう！
            </p>

            {!hasVoted ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {Object.entries(data).map(([key, info]) => (
                        <button
                            key={key}
                            onClick={() => handleVote(key)}
                            className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all hover:scale-105 group"
                        >
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400">{info.name}</h3>
                            <div className="text-4xl mb-2">
                                {key === 'AI_Robot' && '🤖'}
                                {key === 'Quantum' && '⚛️'}
                                {key === 'Semi' && '📱'}
                                {key === 'Bio' && '💊'}
                                {key === 'Fusion' && '☀️'}
                                {key === 'Space' && '🚀'}
                            </div>
                            <div className={`text-xl font-bold mb-4 ${info.change > 0 ? 'text-red-400' : info.change < 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                {info.change > 0 ? '+' : ''}{info.change}%
                            </div>
                            <p className="text-gray-400 text-sm">クリックして投票</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 mb-8">
                        <h2 className="text-2xl font-bold mb-4">結果発表</h2>
                        <p className="mb-4">
                            あなたは <span className="text-blue-400 font-bold">{data[selectedSector].name}</span> に投票しました。
                        </p>

                        <div className="h-[400px] w-full mb-8">
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
                                    <Bar dataKey="Growth" fill="#8884d8" name="市場パフォーマンス (平均騰落率)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Stock Details List */}
                        {data[selectedSector].tickers && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4 text-gray-200">
                                    {data[selectedSector].name} 構成銘柄 (10社)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data[selectedSector].tickers.map((stock) => (
                                        <div key={stock.ticker} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-lg">{TICKER_NAMES[stock.ticker] || stock.ticker}</div>
                                                <div className="text-sm text-gray-400">{stock.ticker}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold text-lg ${stock.change > 0 ? 'text-red-400' : stock.change < 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                                    {stock.change > 0 ? '+' : ''}{stock.change}%
                                                </div>
                                                <div className="text-sm text-gray-400">¥{stock.price.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mt-8 text-right">
                            ※市場パフォーマンスは各分野の代表10銘柄の直近騰落率平均です。<br />
                            データ更新日: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <button
                        onClick={() => setHasVoted(false)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        もう一度投票する
                    </button>
                </div>
            )}
        </div>
    )
}

export default App
