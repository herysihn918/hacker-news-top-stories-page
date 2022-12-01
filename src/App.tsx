import { useEffect, useState, useRef, useCallback, Fragment } from 'react';

import './App.css';
import { HackNewsItem, LoadingIndicator } from './components'

type GetTopHackerNewsIdsFunction = () => Promise<number[]>

const getTopHackerNewsIds: GetTopHackerNewsIdsFunction = async () => {
    let response = await fetch(`https://hacker-news.firebaseio.com/v0/topstories.json`);
    let json = await response.json()
    return json
}

function App() {
  const [itemIds, setItems] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showCount, setShowCount] = useState<number>(10)
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollHandler = useCallback(() => {
    if (containerRef.current !== null) {
      if (containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight) {
        setShowCount(prevCount => Math.min(itemIds.length, prevCount + 6))
      }
    }
  }, [setShowCount, itemIds, containerRef])

  useEffect(() => {
    const effectFunc = async () => {
      setLoading(true)
      let ids: number[] = await getTopHackerNewsIds()
      setItems(ids)
      setTimeout(() => setLoading(false), 1000)
    }
    effectFunc()
  }, [setItems, setLoading])
  return (
    <Fragment>
      <div ref={containerRef} className='container' onScroll={scrollHandler}>
        <h1>Hacker News Top Stories</h1>
        {loading ? (
          <LoadingIndicator loadingText='Fetching News from HackerNews ...' />
        ) : (
          <Fragment>
            {itemIds.map((id, idx) => (
              idx < showCount && <HackNewsItem key={`news-item-${idx}`} itemId={id} />
            ))}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default App;
