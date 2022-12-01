import * as React from 'react';
import logo from './logo.svg';
import linkIcon from './link.png'

interface HackerNewsInfo {
    by: string;
    title: string;
    id: number;
    url: string;
}

type GetHackerNewsItemFunction = (itemId: number) => Promise<HackerNewsInfo>

const getHackerNewsItem: GetHackerNewsItemFunction = async (itemID: number) => {
    let response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${itemID}.json`);
    let json = await response.json();
    return {
        by: json['by'],
        title: json['title'],
        id: json['id'],
        url: json['url']
    }
}

interface LoadingIndicatorProps {
    loadingText: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({loadingText}) => {
    return (
        <div style={{width: '100%', textAlign: 'center'}}>
            <img src={logo} className="loading-logo" />
            <div> { loadingText } </div>
        </div>
    )
}

interface HackerNewsItemProps {
    itemId: number;
}

const HackNewsItem: React.FC<HackerNewsItemProps> = ({itemId}) => {
    const [itemInfo, setItemInfo] = React.useState<HackerNewsInfo | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    React.useEffect(() => {
        const effectFunc = async () => {
            setLoading(true)
            let data = await getHackerNewsItem(itemId);
            setItemInfo(data)
            setTimeout(() => setLoading(false), 1000)
        }
        effectFunc()
    }, [itemId, setItemInfo, setLoading])
    return (
        <div className='news-item'>
            {itemInfo !== null && (
                <div >
                    {loading ? <LoadingIndicator loadingText='Fetching the news information ...' /> : (
                        <React.Fragment>
                            <div className='title'>
                                {itemInfo.title}
                            </div>
                            <div className='author'>
                                by {itemInfo.by}
                            </div>
                            <div>
                                <a href={itemInfo.url} target='_blank'>Story Link&nbsp;&nbsp;<img src={linkIcon} style={{width: 14, height: 14, marginBottom: -3}} /></a>
                            </div>
                        </React.Fragment>
                    )}
                    
                </div>
            )}
        </div>
    )
}

export {
    HackNewsItem, LoadingIndicator
}